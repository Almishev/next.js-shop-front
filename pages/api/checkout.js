import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";
import {Order} from "@/models/Order";
const stripe = require('stripe')(process.env.STRIPE_SK);
import {deleteS3Objects} from "@/lib/s3";

export default async function handler(req,res) {
  if (req.method !== 'POST') {
    res.json('should be a POST request');
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
  
  // Конвертираме ID-тата в ObjectId за правилно търсене
  const mongoose = require('mongoose');
  const objectIds = uniqueIds.map(id => {
    try {
      return mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : id;
    } catch (e) {
      return id;
    }
  });
  
  const productsInfos = await Product.find({_id: {$in: objectIds}});
  console.log('Found products:', productsInfos.length);
  console.log('Looking for IDs:', uniqueIds);
  console.log('Found product IDs:', productsInfos.map(p => p._id.toString()));

  // Валидация на наличността преди създаване на поръчка
  for (const productId of uniqueIds) {
    // Търсим по string сравнение, защото productId е string
    const productInfo = productsInfos.find(p => {
      const productIdStr = p._id.toString();
      const searchIdStr = productId.toString();
      return productIdStr === searchIdStr;
    });
    
    if (!productInfo) {
      console.error('Product not found:', {
        searchedId: productId,
        searchedIdType: typeof productId,
        availableIds: productsInfos.map(p => ({id: p._id.toString(), type: typeof p._id}))
      });
      return res.status(400).json({
        success: false,
        error: `Продукт с ID ${productId} не е намерен`
      });
    }
    
    const quantity = productsIds.filter(id => id === productId)?.length || 0;
    const availableStock = productInfo.stock || 0;
    
    if (quantity > availableStock) {
      return res.status(400).json({
        success: false,
        error: `Няма достатъчна наличност за "${productInfo.title}". Налични: ${availableStock}, Искани: ${quantity}`
      });
    }
  }

  let line_items = [];
  for (const productId of uniqueIds) {
    const productInfo = productsInfos.find(p => {
      const productIdStr = p._id.toString();
      const searchIdStr = productId.toString();
      return productIdStr === searchIdStr;
    });
    const quantity = productsIds.filter(id => id.toString() === productId.toString())?.length || 0;
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
      paymentMethod: paymentMethod || 'stripe',
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
            // Взимаме снимките преди изтриване
            const images = Array.isArray(prod?.images) ? prod.images : [];
            await Product.deleteOne({_id: productId});
            // Изтриваме снимките от S3
            if (images.length > 0) {
              try {
                await deleteS3Objects(images);
                console.log(`Deleted ${images.length} images from S3 for product ${productId}`);
              } catch (s3Error) {
                console.error(`Error deleting images from S3 for product ${productId}:`, s3Error);
              }
            }
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