import passport from "passport";
import { Request, Response, NextFunction } from "express";

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: Error | null, user: any, info: any) => {
      if (err) {
        return res.status(500).json({ msg: "Internal server error" });
      }
      if (!user) {
        return res.status(401).json({ msg: "Unauthorized" });
      }
      req.user = user;
      next();
    }
  )(req, res, next);
};

export default authenticateJWT;
