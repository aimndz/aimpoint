import express, { Request, Response, NextFunction } from "express";

import commentsRouter from "./routes/commentsRouter";
import postsRouter from "./routes/postsRouter";
import authRouter from "./routes/authRouter";
import { format } from "path";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/posts", postsRouter);
app.use("/posts/:postid/comments", commentsRouter);

// Error-handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
