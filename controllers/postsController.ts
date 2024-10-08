import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { body, validationResult } from "express-validator";

import { PrismaClient, User } from "@prisma/client";
const prisma = new PrismaClient();

const postsController = {
  index: asyncHandler(async (req: Request, res: Response) => {
    const user = req.user as User;
    const userRole = user?.role;

    // If user is an admin, return all posts
    if (userRole === "ADMIN") {
      const posts = await prisma.post.findMany({
        include: {
          _count: {
            select: { Comment: true },
          },
        },
      });
      res.status(200).json(posts);
      return;
    }

    // If user is not an admin, return only published posts
    const posts = await prisma.post.findMany({
      where: {
        published: true,
      },
      include: {
        _count: {
          select: { Comment: true },
        },
      },
    });

    res.status(200).json(posts);
  }),

  getPostById: asyncHandler(async (req: Request, res: Response) => {
    const user = req.user as User;
    const userRole = user?.role;
    const postId = req.params.id;

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        _count: {
          select: { Comment: true },
        },
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

  createPost: [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ max: 255 })
      .withMessage("Title must be less than 255 characters"),
    body("content")
      .trim()
      .notEmpty()
      .withMessage("Content is required")
      .isLength({ max: 3000 })
      .withMessage("Content must be less than 3000 characters"),

    asyncHandler(async (req: Request, res: Response) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const user = req.user as User;
      const userId = user?.id;
      const userRole = user?.role;

      // Only admins can create unpublished posts
      if (userRole !== "ADMIN") {
        res.status(403).json({
          msg: "Forbidden: Only admins can create posts.",
        });
        return;
      }

      const { title, content, isPublished } = req.body;

      // Create post
      const post = await prisma.post.create({
        data: {
          title,
          content,
          published: isPublished,
          publishedAt: isPublished ? new Date() : null, // Set publishedAt if isPublished is true
          userId,
        },
      });

      res.status(201).json(post);
    }),
  ],

  updatePost: [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ max: 255 })
      .withMessage("Title must be less than 255 characters"),
    body("content")
      .trim()
      .notEmpty()
      .withMessage("Content is required")
      .isLength({ max: 3000 })
      .withMessage("Content must be less than 3000 characters"),
    body("isPublished")
      .optional()
      .isBoolean()
      .withMessage("isPublished must be a boolean"),

    asyncHandler(async (req: Request, res: Response) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const user = req.user as User;
      const userId = user?.id;

      const postId = req.params.id;
      const userRole = user?.role;

      // Check if post exists
      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
      });

      if (!post) {
        res.status(404).json({ msg: "Post not found" });
        return;
      }

      // Only admins can update posts
      if (userRole !== "ADMIN" && post.userId !== userId) {
        res.status(403).json({
          msg: "Forbidden: You don't have permission to update this post.",
        });
        return;
      }

      const { title, content, isPublished } = req.body;

      // Update post
      const updatedPost = await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          title,
          content,
          published: isPublished,
          publishedAt: isPublished ? new Date() : null, // Set publishedAt if isPublished is true
        },
      });

      res.status(201).json(updatedPost);
    }),
  ],

  deletePost: asyncHandler(async (req, res) => {
    const user = req.user as User;
    const userId = user?.id;

    const postId = req.params.id;
    const userRole = user?.role;

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      res.status(404).json({ msg: "Post not found" });
      return;
    }

    // Only admins can delete posts
    if (userRole !== "ADMIN" && post.userId !== userId) {
      res.status(403).json({
        msg: "Forbidden: You don't have permission to delete this post.",
      });
      return;
    }

    // Delete post
    const deletedPost = await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    res.status(200).json(deletedPost);
  }),
};

export default postsController;
