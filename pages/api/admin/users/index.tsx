import nc from "next-connect";
import { isAdmin, isAuth } from "../../../../utils/auth";
import type { NextApiRequest, NextApiResponse } from "next";
import User from "../../../../models/User";
import db from "../../../../utils/db";

const handler = nc();
// handler.use(isAuth, isAdmin);

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const user = await User.find({});
  await db.disconnect();
  res.send(user);
});

export default handler;
