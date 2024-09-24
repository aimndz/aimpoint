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

  getPostById: asyncHandler(async (req: Request, res: Response) => {
    const userRole = req.user?.role;
    const postId = req.params.id;

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    // Not exists
    if (!post) {
      res.status(404).json({ msg: "Post not found" });
      return;
    }

    // ADMIN -> Can access all posts
    // USER -> Cannot access unpublished posts

    // Cannot access if not an ADMIN and post is unpublished
    if (userRole === "USER" && !post.published) {
      res
        .status(403)
        .json({ msg: "Forbidden: You do not have access to this post." });
      return;
    }

    res.status(200).json(post);
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
