import AppError from "../middleware/errorHandler.js";
import AuthModel from "../models/auth-model.js";
import * as argon from "argon2";
import jwt from "jsonwebtoken";
import { generateRefreshToken, generateAccessToken } from "../utils/jwt.js";

const AuthController = {
  // Create user
  async registerUser(req, res, next) {
    // Get user information
    const { firstName, lastName, email, password } = req.body;

    // Hash user's password
    const hashedPassword = await argon.hash(`${password}`);

    // Pass user information to database
    const newUserId = await AuthModel.registerUser(
      firstName,
      lastName,
      email,
      hashedPassword
    );

    // Send success message
    res
      .status(201)
      .json({ message: "User registered successfully", userID: newUserId });
  },

  // Find user by their ID
  async findUserById(req, res, next) {
    // Get user's information
    const { id } = req.params;
    const user = await AuthModel.findUserByID(id);

    //Check if user exists in the database
    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Send success message
    res.status(200).json({ message: "User found successfully", user: user });
  },

  // Update a user's names
  async updateUserNames(req, res, next) {
    // get user's information
    const { id } = req.params;
    const { newFirstName, newLastName } = req.body;

    // Check if user exists in database
    const user = await AuthModel.findUserByID(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Update names
    await AuthModel.updateUserNames(user.user_id, newFirstName, newLastName);

    // Send success message
    res.status(200).json({
      message: "User's names updated successfully",
      newFirstName: newFirstName,
      newLastName: newLastName,
    });
  },

  // Update a users password
  async updateUserPassword(req, res, next) {
    // Get user information
    const { id } = req.params;
    const { password, newPassword } = req.body;

    // Check if user exists
    const user = await AuthModel.findUserByID(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Check if the current password matches stored password
    const storedHash = await AuthModel.getUserPassword(user.user_id);

    if (await argon.verify(`${storedHash}`, `${password}`)) {
      // Passwords match
      const newHashPassword = await argon.hash(`${newPassword}`);
      await AuthModel.updatePassword(user.user_id, newHashPassword);
    } else {
      // Passwords do not match
      throw new AppError("Invalid password or email", 401);
    }

    // Send success message
    res.status(200).json({
      message: "User password updated successfully.",
    });
  },

  // Delete a user
  async deleteUser(req, res, next) {
    // Get user information
    const { id } = req.params;
    const user = await AuthModel.findUserByID(id);

    // Check if user exists
    if (!user) {
      throw new AppError("User not found", 404);
    }

    await AuthModel.deleteUser(user.user_id);

    // Send success message
    res.status(200).json({
      message: "User deleted successfully",
      user: user,
    });
  },

  // Log a user into the app
  async userLogIn(req, res, next) {
    // Get user information
    const { email, providedPassword } = req.body;
    const user = await AuthModel.findUserByEmail(email);

    // Check if user exists
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    // Verify user password
    const storedHash = user.password;
    if (await argon.verify(`${storedHash}`, `${providedPassword}`)) {
      // Passwords match
      const accessToken = generateAccessToken(user.user_id);
      const refreshToken = generateRefreshToken(user.user_id);

      // Set refresh token cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // Send access token response
      res.status(200).json({
        message: "User logged in successfully",
        accessToken: accessToken,
      });
    } else {
      // Passwords do not match
      throw new AppError("Invalid email or password", 401);
    }
  },

  // Refresh JWT tokens
  async refreshTokenHandler(req, res, next) {
    // Retrieve the token from cookies
    const token = req.cookies?.refreshToken;

    // Check if token exists
    if (!token) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    // Check if the refresh token is valid synchronously
    try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

      // Create new access token
      const newAccessToken = jwt.sign(
        { sub: decoded.sub },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );

      // Return new access token
      return res.json({ accessToken: newAccessToken });
    } catch (error) {
      return res
        .status(403)
        .json({ message: "Invalid or expired refresh token" });
    }
  },
};

export default AuthController;
