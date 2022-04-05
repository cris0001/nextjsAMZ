import nc from "next-connect";
import db from "../../../utils/db";
import type { NextApiRequest, NextApiResponse } from "next";
import Order from "../../../models/Order";
import { onError } from "../../../utils/error";
import { isAuth, isAdmin } from "../../../utils/auth";

const handler = nc({ onError });
// const handler = nc();

// handler.use(isAuth, isAdmin);

handler.get(async (req: any, res: NextApiResponse<any>) => {
  await db.connect();
  const orders = await Order.find({}).populate("user", "name");
  await db.disconnect();
  res.send(orders);
});

export default handler;
