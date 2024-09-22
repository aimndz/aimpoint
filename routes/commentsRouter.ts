import { Router } from "express";
const commentsRouter = Router();

import commentsController from "../controllers/commentsController";

commentsRouter.get("/", commentsController.getAllComments);
commentsRouter.get("/:id", commentsController.getCommentById);

commentsRouter.post("/", commentsController.createComment);
commentsRouter.put("/:id", commentsController.updateComment);
commentsRouter.delete("/:id", commentsController.deleteComment);

export default commentsRouter;
