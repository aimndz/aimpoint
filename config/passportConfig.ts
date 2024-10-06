import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import dotenv from "dotenv";
dotenv.config();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET as string,
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: jwt_payload.user.id,
        },
      });
      if (user) {
        return done(null, user);
      }

      return done(null, false);
    } catch (error) {
      console.error(error);
      done(error, false);
      return;
    }
  })
);

export default passport;
