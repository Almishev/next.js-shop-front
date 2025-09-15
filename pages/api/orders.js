import {mongooseConnect} from "@/lib/mongoose";
import {Order} from "@/models/Order";

export default async function handle(req, res) {
  await mongooseConnect();

  if (req.method === 'GET') {
    const {email} = req.query;
    if (!email) {
      return res.status(400).json({message: 'Email is required'});
    }
    const orders = await Order.find({email}).sort({createdAt: -1});
    res.json(orders);
  } else {
    res.status(405).json({message: 'Method Not Allowed'});
  }
}
