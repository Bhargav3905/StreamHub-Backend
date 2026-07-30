import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;

  // Validate Content
  if (!content?.trim()) {
    throw new ApiError(400, "Tweet content is required.");
  }

  // Create Tweet
  const tweet = await Tweet.create({
    content: content.trim(),
    owner: req.user._id,
  });

  if (!tweet) {
    throw new ApiError(500, "Failed to create tweet.");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, tweet, "Tweet created successfully."));
});

const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  // Validate User ID
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user ID.");
  }

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  // Aggregate Pipeline
  const pipeline = [
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ];

  // Pagination Options
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };

  // Fetch Tweets
  const tweets = await Tweet.aggregatePaginate(
    Tweet.aggregate(pipeline),
    options
  );

  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "Tweets fetched successfully."));
});

const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;

  // Validate Tweet ID
  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID.");
  }

  // Find Tweet
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Tweet not found.");
  }

  // Check Ownership
  if (tweet.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this tweet.");
  }

  // Validate Content
  if (!content?.trim()) {
    throw new ApiError(400, "Tweet content is required.");
  }

  // Update Tweet
  tweet.content = content.trim();
  await tweet.save();
  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet updated successfully."));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  // Validate Tweet ID
  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID.");
  }

  // Find Tweet
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Tweet not found.");
  }

  // Check Ownership
  if (tweet.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this tweet.");
  }

  // Delete Tweet
  await tweet.deleteOne();
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Tweet deleted successfully."));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
