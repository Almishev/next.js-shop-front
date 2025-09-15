import {mongooseConnect} from "@/lib/mongoose";
import {Review} from "@/models/Review";

export default async function handler(req,res) {
  await mongooseConnect();
  const {method} = req;
  if (method === 'GET') {
    const {product} = req.query;
    if (!product) return res.status(400).json({error:'Missing product'});
    const reviews = await Review.find({product}).sort({createdAt:-1});
    return res.json(reviews);
  }
  if (method === 'POST') {
    const {product, rating, title, content, name, email} = req.body;
    if (!product || !rating || !title || !content) {
      return res.status(400).json({error:'Missing required fields'});
    }
    const review = await Review.create({product, rating, title, content, name, email});
    return res.json(review);
  }
  res.status(405).json({error:'Method not allowed'});
}


