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
      include: {
        user: {
          select: {
            username: true,
          },
        },
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
      include: {
        user: {
          select: {
            username: true,
          },
        },
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

  updateComment: [
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

      const postId = req.params.postId;
      const commentId = req.params.commentId;
      const { text } = req.body;

      // Check if comment or posts exists
      const comment = await prisma.comment.findFirst({
        where: {
          id: commentId,
          postId,
        },
      });

      if (!comment) {
        res.status(404).json({ msg: "Comment or Post not found" });
        return;
      }

      // Check if the user logged in is the owner of the comment
      const user = req.user as User;
      if (user?.id !== comment.userId) {
        res
          .status(403)
          .json({ msg: "You are not authorized to edit this comment" });
        return;
      }

      // Update the comment
      const updatedComment = await prisma.comment.update({
        where: {
          id: commentId,
        },
        data: {
          text,
        },
      });

      res.status(201).json(updatedComment);
    }),
  ],

  deleteComment: asyncHandler(async (req: Request, res: Response) => {
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    // Check if comment or posts exists
    const comment = await prisma.comment.findFirst({
      where: {
        id: commentId,
        postId,
      },
    });

    if (!comment) {
      res.status(404).json({ msg: "Comment or Post not found" });
      return;
    }

    // Check if the user logged in is the owner of the comment
    const user = req.user as User;
    if (user?.id !== comment.userId) {
      res
        .status(403)
        .json({ msg: "You are not authorized to delete this comment" });
      return;
    }

    // Delete
    const deletedComment = await prisma.comment.delete({
      where: {
        postId: postId,
        id: commentId,
      },
    });

    res.status(200).json(deletedComment);
  }),
};

export default commentsController;
