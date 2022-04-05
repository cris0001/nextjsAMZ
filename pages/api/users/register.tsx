import nc from "next-connect";
import db from "../../../utils/db";
import bcrypt from "bcryptjs";
import type { NextApiRequest, NextApiResponse } from "next";
import User from "../../../models/User";
import { signToken } from "../../../utils/auth";

const handler = nc();

handler.post(async (req: NextApiRequest, res: NextApiResponse<any>) => {
  await db.connect();
  const newUser: any = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password),
    idAdmin: false,
  });
  const user = await newUser.save();
  console.log(newUser);
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
