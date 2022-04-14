import { NextApiRequest, NextApiResponse } from "next";
import Payjp from 'payjp';

const payjp = Payjp(process.env.PAYJP_SECRET_KEY!)

const cache = new Map()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(JSON.stringify(req.body))
  const { id } = req.query
  const { token } = JSON.parse(req.body);
  if (!cache.get(id)) {
    cache.set(id, token);
  }

  const charge = await payjp.charges.create({
    amount: 1000,
    currency: 'jpy',
    card: cache.get(id)
  }).catch((e: Payjp.ResponseError) => console.error(e?.response?.body as Payjp.PayjpError));
  res.status(200).json({ charge })
}