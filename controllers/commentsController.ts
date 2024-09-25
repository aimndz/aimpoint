import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import { Request, Response } from "express";
import { PrismaClient, User } from "@prisma/client";
const prisma = new PrismaClient();

const commentsController = {
  getAllComments: asyncHandler(async (req: Request, res: Response) => {
    const postId = req.params.postId;

    const comments = await prisma.comment.findMany({
      where: {
        postId: postId,
      },
    });

    res.status(200).json(comments);
  }),

  getCommentById: asyncHandler(async (req, res) => {
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    const comment = await prisma.comment.findUnique({
      where: {
        postId: postId,
        id: commentId,
      },
    });

    res.status(200).json(comment);
  }),

  createComment: [
    body("text")
      .trim()
      .notEmpty()
      .withMessage("Comment text is required")
      .isLength({ max: 200 })
      .withMessage("Comment text must be less than 200 characters"),

    asyncHandler(async (req: Request, res: Response) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const user = req.user as User;
      const userId = user?.id;

      const postId = req.params.postId;
      const { text } = req.body;

      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
      });

      if (!post) {
        res.status(404).json({ msg: "Post not found" });
        return;
      }

      const comment = await prisma.comment.create({
        data: {
          text,
          postId,
          userId,
        },
      });

      res.status(201).json(comment);
    }),
  ],

  updateComment: asyncHandler(async (req, res) => {
    // TODO: UPDATE COMMENT
  }),

  deleteComment: asyncHandler(async (req, res) => {
    // TODO: DELETE COMMENT
  }),
};

export default commentsController;
