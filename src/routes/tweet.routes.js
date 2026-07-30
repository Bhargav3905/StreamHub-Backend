import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createTweet,
  getUserTweets,
  updateTweet,
  deleteTweet,
} from "../controllers/tweet.controller.js";

const router = Router();

// Protected Routes
router.use(verifyJWT);

// Create a tweet
router.route("/").post(createTweet);

// Get all tweets of a user
router.route("/user/:userId").get(getUserTweets);

// Update & Delete a tweet
router.route("/:tweetId").patch(updateTweet).delete(deleteTweet);

export default router;
