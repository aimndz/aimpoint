import { create } from "domain";
import asyncHandler from "express-async-handler";

const postsController = {
  index: asyncHandler(async (req, res) => {
    // TODO: GET ALL POSTS
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
