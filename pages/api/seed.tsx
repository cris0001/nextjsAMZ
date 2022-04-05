import nc from "next-connect";
import db from "../../utils/db";
import type { NextApiRequest, NextApiResponse } from "next";
import Product from "../../models/Product";
import data from "../../utils/data";
import User from "../../models/User";

const handler = nc();

handler.get(async (req: NextApiRequest, res: NextApiResponse<any>) => {
  await db.connect();
  await User.deleteMany();
  await User.insertMany(data.users);
  await Product.deleteMany();
  await Product.insertMany(data.products);
  await db.disconnect();
  res.send("success");
});

export default handler;
