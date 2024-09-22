import asyncHandler from "express-async-handler";

const authController = {
  login: asyncHandler(async (req, res) => {
    // TODO: LOGIN
  }),

  sign_up: asyncHandler(async (req, res) => {
    // TODD: SIGN UP
  }),

  logout: asyncHandler(async (req, res) => {
    // TODO: LOGOUT
  }),
};

export default authController;
