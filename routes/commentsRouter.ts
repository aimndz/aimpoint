import { Router } from "express";
const commentsRouter = Router({ mergeParams: true });

import authenticateJWT from "../middlewares/authMiddleware";
import commentsController from "../controllers/commentsController";

commentsRouter.get("/", commentsController.getAllComments);
commentsRouter.get("/:commentId", commentsController.getCommentById);

commentsRouter.post("/", authenticateJWT, commentsController.createComment);
commentsRouter.put(
  "/:commentId",
  authenticateJWT,
  commentsController.updateComment
);
commentsRouter.delete(
  "/:commentId",
  authenticateJWT,
  commentsController.deleteComment
);

export default commentsRouter;
