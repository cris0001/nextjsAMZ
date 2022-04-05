import nc from "next-connect";
import db from "../../../utils/db";
import bcrypt from "bcryptjs";
import type { NextApiRequest, NextApiResponse } from "next";
import User from "../../../models/User";
import { signToken, isAuth } from "../../../utils/auth";

const handler = nc();
// handler.use(isAuth);

handler.put(async (req: any, res: NextApiResponse<any>) => {
  await db.connect();
  const user = await User.findById(req.body.userInfo._id);
  user.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password ? bcrypt.hashSync(req.body.password) : user.password;
  await user.save();
  await db.disconnect();

  const token = signToken(user);
  res.send({
    token,
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

export default handler;
