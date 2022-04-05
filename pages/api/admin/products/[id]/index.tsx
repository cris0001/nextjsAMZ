import nc from "next-connect";
import db from "../../../../../utils/db";
import type { NextApiRequest, NextApiResponse } from "next";
import Product from "../../../../../models/Product";
import { onError } from "../../../../../utils/error";
import { isAuth, isAdmin } from "../../../../../utils/auth";

const handler = nc({ onError });
// const handler = nc();
// handler.use(isAuth, isAdmin);

handler.get(async (req: any, res: NextApiResponse<any>) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  await db.disconnect();
  res.send(product);
});

handler.delete(async (req: NextApiRequest, res: NextApiResponse<any>) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  if (product) {
    await product.remove();
    await db.disconnect();
    res.send({ message: "product deleted" });
  } else {
    await db.disconnect();
    res.status(404).send({ message: "product not found" });
  }
});

handler.put(async (req: any, res: NextApiResponse<any>) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  if (product) {
    product.name = req.body.name;
    product.slug = req.body.slug;
    product.price = req.body.price;
    product.category = req.body.category;
    product.image = req.body.image;
    product.brand = req.body.brand;
    product.countInStock = req.body.countInStock;
    product.description = req.body.description;
    await product.save();
    await db.disconnect();
    res.send({ message: "product updated" });
  } else {
    await db.disconnect();
    res.status(404).send({ message: "product not found" });
  }
});

export default handler;
