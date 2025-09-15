import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema({
  email: {type: String, required: true},
  productId: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
}, {
  timestamps: true,
});

// Ensure unique combination of email and productId
WishlistSchema.index({ email: 1, productId: 1 }, { unique: true });

export const Wishlist = mongoose.models.Wishlist || mongoose.model('Wishlist', WishlistSchema);
