import nc from "next-connect";
import db from "../../../utils/db";
import type { NextApiRequest, NextApiResponse } from "next";
import Order from "../../../models/Order";
import { onError } from "../../../utils/error";
import { isAuth, isAdmin } from "../../../utils/auth";
import Product from "../../../models/Product";
import User from "../../../models/User";

const handler = nc({ onError });
// const handler = nc();

// handler.use(isAuth, isAdmin);

handler.get(async (req: any, res: NextApiResponse<any>) => {
  await db.connect();
  const ordersCount = await Order.countDocuments();
  const productsCount = await Product.countDocuments();
  const usersCount = await User.countDocuments();
  const ordersPriceGroup = await Order.aggregate([
    {
      $group: {
        _id: null,
        sales: { $sum: "$totalPrice" },
      },
    },
  ]);
  const ordersPrice = ordersPriceGroup.length > 0 ? ordersPriceGroup[0].sales : 0;
  const salesData = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        totalSales: { $sum: "$totalPrice" },
      },
    },
  ]);
  await db.disconnect();
  res.send({ ordersCount, productsCount, usersCount, ordersPrice, salesData });
});

export default handler;
