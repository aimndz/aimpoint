import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const authController = {
  login: asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { username, password } = req.body;

      try {
        const user = await prisma.user.findUnique({
          where: {
            username: username,
          },
        });

        // Check if user exists
        if (!user || !(await bcrypt.compare(password, user.password))) {
          res.status(401).json({ msg: "Invalid username or password" });
          return;
        }

        // Generate JWT token
        const payload = { id: user.id, username: user.username };
        const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
          expiresIn: "1h",
        });

        // Successful login
        res.status(200).json({ msg: "Login successful", token });
      } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
      }
    }
  ),

  sign_up: [
    body("firstName")
      .trim()
      .notEmpty()
      .withMessage("First name is required")
      .isLength({ max: 35 })
      .withMessage("First name must be less than 35 characters"),

    body("lastName")
      .trim()
      .notEmpty()
      .withMessage("Last name is required")
      .isLength({ max: 35 })
      .withMessage("Last name must be less than 35 characters"),

    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ max: 35 })
      .withMessage("Username must be less than 35 characters")
      .custom(async (value) => {
        const user = await prisma.user.findUnique({
          where: {
            username: value,
          },
        });

        if (user) {
          throw new Error("Username is already taken");
        }

        return true;
      }),

    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters")
      .matches(/\d/)
      .withMessage("Password must contain a number")
      .matches(/[a-zA-Z]/)
      .withMessage("Password must contain a letter")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("Password must contain a special character"),

    body("confirmPassword")
      .trim()
      .notEmpty()
      .withMessage("Confirm password is required")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not match");
        }
        return true;
      }),

    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { firstName, lastName, username, password } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      try {
        await prisma.user.create({
          data: {
            firstName,
            lastName,
            username,
            password: hashedPassword,
          },
        });

        res.status(201).json({ msg: "User created successfully" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
      }
    }),
  ],

  logout: asyncHandler(async (req, res) => {
    // TODO: LOGOUT
  }),
};

export default authController;
