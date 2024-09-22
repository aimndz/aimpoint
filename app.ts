import express from "express";

import commentsRouter from "./routes/commentsRouter";
import postsRouter from "./routes/postsRouter";
import authRouter from "./routes/authRouter";

const app = express();

app.use("/auth", authRouter);
app.use("/posts", postsRouter);
app.use("/posts/:postid/comments", commentsRouter);

const PORT = 5000;
app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
