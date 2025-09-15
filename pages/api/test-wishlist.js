import {mongooseConnect} from "@/lib/mongoose";
import {Wishlist} from "@/models/Wishlist";
import {Product} from "@/models/Product";

export default async function handle(req, res) {
  await mongooseConnect();

  try {
    // Check if wishlist collection exists and has data
    const allWishlists = await Wishlist.find({});
    console.log('All wishlists in database:', allWishlists);
    
    // Check if products collection exists
    const allProducts = await Product.find({});
    console.log('All products in database:', allProducts.length);
    
    // Test specific email
    const testEmail = 'alimkunev123@gmail.com';
    const userWishlist = await Wishlist.find({email: testEmail}).populate('productId');
    console.log('User wishlist for', testEmail, ':', userWishlist);
    
    res.json({
      totalWishlists: allWishlists.length,
      totalProducts: allProducts.length,
      userWishlist: userWishlist,
      allWishlists: allWishlists
    });
  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({error: error.message});
  }
}
