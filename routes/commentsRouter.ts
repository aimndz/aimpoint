import { Router } from "express";
const commentsRouter = Router({ mergeParams: true });

import commentsController from "../controllers/commentsController";

commentsRouter.get("/", commentsController.getAllComments);
commentsRouter.get("/:commentId", commentsController.getCommentById);

commentsRouter.post("/", commentsController.createComment);
commentsRouter.put("/:commentId", commentsController.updateComment);
commentsRouter.delete("/:commentId", commentsController.deleteComment);

export default commentsRouter;
