import {mongooseConnect} from "@/lib/mongoose";
const stripe = require('stripe')(process.env.STRIPE_SK);
import {buffer} from 'micro';
import {Order} from "@/models/Order";
import {Product} from "@/models/Product";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req,res) {
  // Логваме метода за дебъг - ВИНАГИ логваме, дори и при GET заявки
  console.log('=== WEBHOOK ENDPOINT CALLED ===');
  console.log('Webhook request method:', req.method);
  console.log('Webhook request URL:', req.url);
  console.log('Webhook request headers:', JSON.stringify(req.headers, null, 2));
  console.log('Timestamp:', new Date().toISOString());
  
  if (req.method !== 'POST') {
    console.error('Invalid method:', req.method);
    console.error('Expected POST, got:', req.method);
    res.status(405).json({
      error: 'Method not allowed', 
      method: req.method,
      allowed: ['POST'],
      message: 'This endpoint only accepts POST requests'
    });
    return;
  }

  // Проверка за webhook secret
  if (!endpointSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    res.status(500).send('Webhook secret not configured');
    return;
  }

  try {
    await mongooseConnect();
  } catch (dbError) {
    console.error('MongoDB connection error:', dbError);
    res.status(500).send('Database connection error');
    return;
  }

  const sig = req.headers['stripe-signature'];
  
  if (!sig) {
    console.error('Missing stripe-signature header');
    res.status(400).send('Missing signature');
    return;
  }

  let event;

  try {
    const buf = await buffer(req);
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    console.error('Signature:', sig);
    console.error('Endpoint secret exists:', !!endpointSecret);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  console.log('Webhook event received:', event.type);
  console.log('Event data:', JSON.stringify(event.data, null, 2));
  
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const orderId = session.metadata?.orderId;
      const paymentStatus = session.payment_status;
      
      console.log('Checkout session completed:', {
        orderId,
        paymentStatus,
        sessionId: session.id,
        amount_total: session.amount_total,
        currency: session.currency,
        payment_status: session.payment_status,
        metadata: session.metadata
      });

      if (!orderId) {
        console.log('No orderId in metadata, skipping');
        res.status(200).send('ok');
        return;
      }

      if (paymentStatus === 'paid') {
        try {
          console.log('Processing paid order:', orderId);
          console.log('Session metadata:', session.metadata);
          
          // Обновяваме поръчката като платена
          await Order.findByIdAndUpdate(orderId, {
            paid: true,
          });

          // Намаляваме наличностите след успешно плащане
          let cartProducts = [];
          try {
            if (session.metadata?.cartProducts) {
              console.log('Raw cartProducts from metadata:', session.metadata.cartProducts);
              cartProducts = JSON.parse(session.metadata.cartProducts);
              console.log('Parsed cartProducts:', cartProducts);
            } else {
              console.log('No cartProducts in metadata');
            }
          } catch (e) {
            console.error('Error parsing cartProducts from metadata:', e);
            console.error('Metadata cartProducts value:', session.metadata?.cartProducts);
          }

          // Ако няма cartProducts в metadata, опитваме от line_items
          let order = null;
          if (cartProducts.length === 0) {
            console.log('cartProducts is empty, trying to get from order line_items');
            order = await Order.findById(orderId);
            if (order && order.line_items) {
              const lineItems = order.line_items;
              console.log('Order line_items:', lineItems);
              for (const item of lineItems) {
                if (item.price_data && item.price_data.product_data) {
                  const productName = item.price_data.product_data.name;
                  if (productName !== 'Доставка') {
                    const product = await Product.findOne({ title: productName });
                    if (product) {
                      const quantity = item.quantity || 1;
                      console.log(`Found product "${productName}" with quantity ${quantity}`);
                      // Добавяме продукта толкова пъти, колкото е quantity
                      for (let i = 0; i < quantity; i++) {
                        cartProducts.push(product._id.toString());
                      }
                    } else {
                      console.error(`Product not found by name: ${productName}`);
                    }
                  }
                }
              }
            } else {
              console.error('Order not found or has no line_items');
            }
          }

          // Намаляваме наличностите
          console.log('Cart products before processing:', cartProducts);
          const uniqueIds = [...new Set(cartProducts)];
          console.log('Unique product IDs:', uniqueIds);
          const mongoose = require('mongoose');
          
          if (uniqueIds.length === 0) {
            console.error('No products found to update stock!');
            console.log('Order line_items:', order?.line_items);
          }
          
          for (const productId of uniqueIds) {
            try {
              const qty = cartProducts.filter(id => id.toString() === productId.toString()).length;
              if (!qty) continue;
              
              // Конвертираме string ID в ObjectId
              let objectId;
              try {
                objectId = mongoose.Types.ObjectId.isValid(productId) 
                  ? new mongoose.Types.ObjectId(productId) 
                  : productId;
              } catch (e) {
                console.error(`Invalid product ID: ${productId}`, e);
                continue;
              }
              
              const prod = await Product.findById(objectId);
              if (!prod) {
                console.error(`Product not found: ${productId}`);
                continue;
              }
              
              console.log(`Updating stock for product ${productId}: current=${prod.stock}, quantity=${qty}`);
              const newStock = Math.max(0, (prod.stock || 0) - qty);
              
              if (newStock === 0) {
                await Product.deleteOne({ _id: objectId });
                console.log(`Product ${productId} deleted (stock reached 0)`);
              } else {
                await Product.updateOne({ _id: objectId }, { stock: newStock });
                console.log(`Product ${productId} stock updated to ${newStock}`);
              }
            } catch (prodError) {
              console.error(`Error updating product ${productId}:`, prodError);
            }
          }

          console.log('Order updated successfully:', orderId);
        } catch (updateError) {
          console.error('Error updating order:', updateError);
          // Връщаме успех дори при грешка, за да не се опитва Stripe отново
        }
      } else {
        console.log(`Payment status is not 'paid': ${paymentStatus}`);
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Винаги връщаме успешен response
  // Използваме .json() за по-надежден response
  return res.status(200).json({received: true});
}

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

// bright-thrift-cajole-lean
// acct_1Lj5ADIUXXMmgk2a