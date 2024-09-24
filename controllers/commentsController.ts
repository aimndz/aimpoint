import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
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
    // TODO: GET COMMENT BY ID
  }),

  createComment: asyncHandler(async (req, res) => {
    // TODO: CREATE COMMENT
  }),

  updateComment: asyncHandler(async (req, res) => {
    // TODO: UPDATE COMMENT
  }),

  deleteComment: asyncHandler(async (req, res) => {
    // TODO: DELETE COMMENT
  }),
};

export default commentsController;
