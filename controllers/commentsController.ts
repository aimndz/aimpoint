import asyncHandler from "express-async-handler";

const commentsController = {
  getAllComments: asyncHandler(async (req, res) => {
    // TODO: GET ALL COMMENTS
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
