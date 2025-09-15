import mongoose, {model, models, Schema} from "mongoose";

const ReviewSchema = new Schema({
  product: { type: mongoose.Types.ObjectId, ref: 'Product', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  name: { type: String },
  email: { type: String },
}, {
  timestamps: true,
});

export const Review = models.Review || model('Review', ReviewSchema);


