import nc from "next-connect";
import db from "../../../utils/db";
import type { NextApiRequest, NextApiResponse } from "next";
import Product from "../../../models/Product";
import { Item } from "../../../types";

const handler = nc();

handler.get(async (req: NextApiRequest, res: NextApiResponse<Item>) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  await db.disconnect();
  res.send(product);
});

export default handler;
