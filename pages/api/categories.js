import {mongooseConnect} from "@/lib/mongoose";
import {Category} from "@/models/Category";

export default async function handle(req, res) {
  await mongooseConnect();

  if (req.method === 'GET') {
    const categories = await Category.find();
    res.json(categories);
  }
}
