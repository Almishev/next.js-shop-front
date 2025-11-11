import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";
import {Order} from "@/models/Order";
const stripe = require('stripe')(process.env.STRIPE_SK);

export default async function handler(req,res) {
  if (req.method !== 'POST') {
    res.status(405).json({error: 'should be a POST request'});
    return;
  }
  const {
    name,email,phone,city,
    postalCode,streetAddress,country,
    cartProducts,shippingPrice,paymentMethod,
  } = req.body;
  
  console.log('Checkout request body:', req.body);
  console.log('Email from request:', email);
  console.log('Phone from request:', phone);
  console.log('MongoDB URI:', process.env.MONGODB_URI);
  
  await mongooseConnect();
  console.log('MongoDB connected successfully');
  
  const productsIds = cartProducts;
  const uniqueIds = [...new Set(productsIds)];
  const productsInfos = await Product.find({_id:uniqueIds});
  console.log('Found products:', productsInfos.length);

  let line_items = [];
  for (const productId of uniqueIds) {
    const productInfo = productsInfos.find(p => p._id.toString() === productId);
    const quantity = productsIds.filter(id => id === productId)?.length || 0;
    if (quantity > 0 && productInfo) {
      line_items.push({
        quantity,
        price_data: {
          currency: 'BGN',
          product_data: {name:productInfo.title},
          unit_amount: Math.round(productInfo.price * 100), // Цена за единица в стотинки
        },
      });
    }
  }

  // Добавяме shipping като отделен item
  if (shippingPrice > 0) {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: 'BGN',
        product_data: {name: 'Доставка'},
        unit_amount: Math.round(shippingPrice * 100),
      },
    });
  }

  try {
    const orderDoc = await Order.create({
      line_items,name,email,phone,city,postalCode,
      streetAddress,country,paid:false,
    });
    
    console.log('Created order:', orderDoc._id.toString());
    console.log('Payment method:', paymentMethod);

    // Ако е избран наложен платеж
    if (paymentMethod === 'cash') {
      // Намаляваме наличностите веднага за наложен платеж
      try {
        for (const productId of uniqueIds) {
          const qty = productsIds.filter(id => id === productId)?.length || 0;
          if (!qty) continue;
          const prod = await Product.findById(productId);
          if (!prod) continue;
          const newStock = Math.max(0, (prod.stock || 0) - qty);
          if (newStock === 0) {
            await Product.deleteOne({_id: productId});
          } else {
            await Product.updateOne({_id: productId}, {stock: newStock});
          }
        }
      } catch (invErr) {
        console.error('Inventory update error:', invErr);
      }
      
      res.json({
        success: true,
        orderId: orderDoc._id.toString(),
        message: 'Поръчката е създадена успешно. Ще платите при доставка.'
      });
      return;
    }

    // За Stripe плащане - създаваме Checkout Session
    // НЕ намаляваме наличността тук - ще се случи в webhook след успешно плащане
    if (paymentMethod === 'stripe' || !paymentMethod) {
      const session = await stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        customer_email: email,
        success_url: process.env.PUBLIC_URL + '/cart?success=1',
        cancel_url: process.env.PUBLIC_URL + '/cart?canceled=1',
        metadata: {
          orderId: orderDoc._id.toString(),
          name: name,
          email: email,
          phone: phone,
          cartProducts: JSON.stringify(cartProducts),
        },
      });

      res.json({
        success: true,
        url: session.url,
        sessionId: session.id,
      });
      return;
    }

    // Fallback - ако няма избран метод
    res.status(400).json({
      success: false,
      error: 'Моля, изберете метод на плащане'
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      error: 'Грешка при създаване на поръчката: ' + error.message
    });
  }

}