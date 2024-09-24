import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const postsController = {
  index: asyncHandler(async (req: Request, res: Response) => {
    const userRole = req.user?.role;

    // If user is an admin, return all posts
    if (userRole === "ADMIN") {
      const posts = await prisma.post.findMany();
      res.status(200).json(posts);
      return;
    }

    // If user is not an admin, return only published posts
    const posts = await prisma.post.findMany({
      where: {
        published: true,
      },
    });

    res.status(200).json(posts);
  }),

  getPostById: asyncHandler(async (req, res) => {
    // TODO: GET POST BY ID
  }),

  createPost: asyncHandler(async (req, res) => {
    // TODO: CREATE POST
  }),

  updatePost: asyncHandler(async (req, res) => {
    // TODO: UPDATE POST
  }),

  deletePost: asyncHandler(async (req, res) => {
    // TODO: DELETE POST
  }),
};

export default postsController;
