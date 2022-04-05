import nc from "next-connect";
import db from "../../../utils/db";
import type { NextApiRequest, NextApiResponse } from "next";
import Order from "../../../models/Order";
import { onError } from "../../../utils/error";
import { isAuth } from "../../../utils/auth";

const handler = nc({ onError });
// const handler = nc();

handler.use(isAuth);

handler.post(async (req: any, res: NextApiResponse<any>) => {
  await db.connect();

  const newOrder = new Order({ ...req.body, user: req.body.userInfo._id });

  const order = await newOrder.save();
  res.status(201).send(order);
  await db.disconnect();
});

export default handler;
