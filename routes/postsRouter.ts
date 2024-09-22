import { Router } from "express";
const postsRouter = Router();

import postsController from "../controllers/postsController";

postsRouter.get("/", postsController.index);
postsRouter.get("/:id", postsController.getPostById);

postsRouter.post("/", postsController.createPost);
postsRouter.put("/:id", postsController.updatePost);
postsRouter.delete("/:id", postsController.deletePost);

export default postsRouter;
