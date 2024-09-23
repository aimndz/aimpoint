import express, { Request, Response, NextFunction } from "express";

import passport from "./config/passportConfig";
import authenticateJWT from "./middlewares/authMiddleware";

import commentsRouter from "./routes/commentsRouter";
import postsRouter from "./routes/postsRouter";
import authRouter from "./routes/authRouter";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport middleware
app.use(passport.initialize());

app.use("/auth", authRouter);
app.use("/posts", authenticateJWT, postsRouter);
app.use("/posts/:postid/comments", authenticateJWT, commentsRouter);

const PORT = 5000;
app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
