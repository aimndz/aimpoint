import { Router } from "express";
const postsRouter = Router();

import authenticateJWT from "../middlewares/authMiddleware";
import postsController from "../controllers/postsController";

postsRouter.get("/", postsController.index);
postsRouter.get("/:id", postsController.getPostById);

postsRouter.post("/", authenticateJWT, postsController.createPost);
postsRouter.put("/:id", authenticateJWT, postsController.updatePost);
postsRouter.delete("/:id", authenticateJWT, postsController.deletePost);

export default postsRouter;
