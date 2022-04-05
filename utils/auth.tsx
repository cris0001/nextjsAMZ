import jwt from "jsonwebtoken";

const signToken = (user: any): any => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },

    process.env.JWT_SECRET as string,
    {
      expiresIn: "30d",
    }
  );
};

const isAuth = async (req: any, res: any, next: any) => {
  const { authorization } = req.headers;
  if (authorization) {
    const token = authorization.slice(5, authorization.length);
    jwt.verify(token, process.env.JWT_SECRET as string, (err: any, decode: any) => {
      if (err) {
        res.status(401).send({ message: "Token is not valid" });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: "Token is not suppiled" });
  }
};

const isAdmin = async (req: any, res: any, next: any) => {
  if (req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: "User is not admin" });
  }
};
// eslint-disable-next-line import/no-anonymous-default-export
export { signToken, isAuth, isAdmin };
