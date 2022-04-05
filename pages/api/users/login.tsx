import nc from "next-connect";
import db from "../../../utils/db";
import bcrypt from "bcryptjs";
import type { NextApiRequest, NextApiResponse } from "next";
import User from "../../../models/User";
import { signToken } from "../../../utils/auth";

const handler = nc();

handler.post(async (req: NextApiRequest, res: NextApiResponse<any>) => {
  await db.connect();
  const user: any = await User.find({ email: req.body.email });
  await db.disconnect();
  if (user && bcrypt.compareSync(req.body.password, user[0].password)) {
    const token = signToken(user);
    res.send({
      token,
      _id: user[0]._id,
      name: user[0].name,
      email: user[0].email,
      isAdmin: user[0].isAdmin,
    });
  } else {
    res.status(401).send({ message: "invalid user or password" });
  }
});

export default handler;
