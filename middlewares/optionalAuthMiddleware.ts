import passport from "passport";
import { Request, Response, NextFunction } from "express";

const optionalAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: Error | null, user: any, info: any) => {
      if (err) {
        return res.status(500).json({ msg: "Internal server error" });
      }

      req.user = user || undefined;
      next();
    }
  )(req, res, next);
};

export default optionalAuthMiddleware;
