import nc from "next-connect";
import db from "../../../../utils/db";
import type { NextApiRequest, NextApiResponse } from "next";
import Order from "../../../../models/Order";
import { isAuth } from "../../../../utils/auth";
import { Ord } from "../../../../types";

const handler = nc();
handler.use(isAuth);
handler.get(async (req: NextApiRequest, res: NextApiResponse<Ord>) => {
  await db.connect();
  const order = await Order.findById(req.query.id);
  await db.disconnect();
  res.send(order);
});

export default handler;
