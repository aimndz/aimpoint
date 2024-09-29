import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

import passport from "./config/passportConfig";
import errorHandler from "./middlewares/errorMiddleware";

import commentsRouter from "./routes/commentsRouter";
import postsRouter from "./routes/postsRouter";
import authRouter from "./routes/authRouter";

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport middleware
app.use(passport.initialize());

// Routes
app.use("/auth", authRouter);
app.use("/posts", postsRouter);
app.use("/posts/:postId/comments", commentsRouter);

// Error handler middleware
app.use(errorHandler);

const PORT = 5000;
app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
