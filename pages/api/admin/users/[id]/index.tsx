import nc from "next-connect";
import db from "../../../../../utils/db";
import type { NextApiRequest, NextApiResponse } from "next";
import User from "../../../../../models/User";
import { onError } from "../../../../../utils/error";
import { isAuth, isAdmin } from "../../../../../utils/auth";

const handler = nc({ onError });
// const handler = nc();
// handler.use(isAuth, isAdmin);

handler.get(async (req: any, res: NextApiResponse<any>) => {
  await db.connect();
  const user = await User.findById(req.query.id);
  await db.disconnect();
  res.send(user);
});

handler.delete(async (req: NextApiRequest, res: NextApiResponse<any>) => {
  await db.connect();
  const user = await User.findById(req.query.id);
  if (user) {
    await user.remove();
    await db.disconnect();
    res.send({ message: "user deleted" });
  } else {
    await db.disconnect();
    res.status(404).send({ message: "user not found" });
  }
});

handler.put(async (req: any, res: NextApiResponse<any>) => {
  await db.connect();
  const user = await User.findById(req.query.id);
  if (user) {
    user.name = req.body.name;
    user.isAdmin = Boolean(req.body.isAdmin);

    await user.save();
    await db.disconnect();
    res.send({ message: "user updated" });
  } else {
    await db.disconnect();
    res.status(404).send({ message: "user not found" });
  }
});

export default handler;
