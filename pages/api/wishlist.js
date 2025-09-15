import {mongooseConnect} from "@/lib/mongoose";
import {Wishlist} from "@/models/Wishlist";
import {Product} from "@/models/Product";

export default async function handle(req, res) {
  console.log('Wishlist API called with method:', req.method);
  await mongooseConnect();

  if (req.method === 'GET') {
    const {email} = req.query;
    console.log('Wishlist GET request for email:', email);
    
    if (!email) {
      return res.status(400).json({message: 'Email is required'});
    }
    
    try {
      const wishlistItems = await Wishlist.find({email}).populate('productId');
      console.log('Found wishlist items:', wishlistItems.length);
      console.log('Wishlist items:', wishlistItems);
      
      const products = wishlistItems.map(item => item.productId).filter(Boolean);
      console.log('Products after filtering:', products.length);
      console.log('Products:', products);
      
      res.json(products);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      res.status(500).json({message: 'Error fetching wishlist'});
    }
  } else if (req.method === 'POST') {
    const {productId, email} = req.body;
    
    if (!productId || !email) {
      return res.status(400).json({message: 'Product ID and email are required'});
    }

    try {
      // Check if product exists
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({message: 'Product not found'});
      }

      // Check if already in wishlist
      const existingItem = await Wishlist.findOne({email, productId});
      if (existingItem) {
        return res.status(400).json({message: 'Product already in wishlist'});
      }

      const wishlistItem = await Wishlist.create({email, productId});
      res.json(wishlistItem);
    } catch (error) {
      if (error.code === 11000) {
        res.status(400).json({message: 'Product already in wishlist'});
      } else {
        res.status(500).json({message: 'Error adding to wishlist'});
      }
    }
  } else if (req.method === 'DELETE') {
    const {productId, email} = req.body;
    
    if (!productId || !email) {
      return res.status(400).json({message: 'Product ID and email are required'});
    }

    try {
      const result = await Wishlist.deleteOne({email, productId});
      if (result.deletedCount === 0) {
        return res.status(404).json({message: 'Item not found in wishlist'});
      }
      res.json({message: 'Item removed from wishlist'});
    } catch (error) {
      res.status(500).json({message: 'Error removing from wishlist'});
    }
  } else {
    res.status(405).json({message: 'Method Not Allowed'});
  }
}
