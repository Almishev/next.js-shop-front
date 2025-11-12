import {mongooseConnect} from "@/lib/mongoose";
const stripe = require('stripe')(process.env.STRIPE_SK);
import {buffer} from 'micro';
import {Order} from "@/models/Order";
import {Product} from "@/models/Product";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req,res) {
  if (req.method !== 'POST') {
    res.status(405).send('Method not allowed');
    return;
  }

  await mongooseConnect();
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    const buf = await buffer(req);
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const orderId = session.metadata?.orderId;
      const paymentStatus = session.payment_status;
      
      console.log('Checkout session completed:', {
        orderId,
        paymentStatus,
        sessionId: session.id
      });

      if (orderId && paymentStatus === 'paid') {
        try {
          // Обновяваме поръчката като платена
          await Order.findByIdAndUpdate(orderId, {
            paid: true,
          });

          // Намаляваме наличностите след успешно плащане
          let cartProducts = [];
          try {
            if (session.metadata?.cartProducts) {
              cartProducts = JSON.parse(session.metadata.cartProducts);
            }
          } catch (e) {
            console.error('Error parsing cartProducts from metadata:', e);
          }

          // Ако няма cartProducts в metadata, опитваме от line_items
          if (cartProducts.length === 0) {
            const order = await Order.findById(orderId);
            if (order && order.line_items) {
              const lineItems = order.line_items;
              for (const item of lineItems) {
                if (item.price_data && item.price_data.product_data) {
                  const productName = item.price_data.product_data.name;
                  if (productName !== 'Доставка') {
                    const product = await Product.findOne({ title: productName });
                    if (product) {
                      const quantity = item.quantity || 1;
                      // Добавяме продукта толкова пъти, колкото е quantity
                      for (let i = 0; i < quantity; i++) {
                        cartProducts.push(product._id.toString());
                      }
                    }
                  }
                }
              }
            }
          }

          // Намаляваме наличностите
          const uniqueIds = [...new Set(cartProducts)];
          const mongoose = require('mongoose');
          
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
        }
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).send('ok');
}

export const config = {
  api: {bodyParser:false,}
};

// bright-thrift-cajole-lean
// acct_1Lj5ADIUXXMmgk2a