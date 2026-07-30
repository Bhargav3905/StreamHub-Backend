import mongoose from "mongoose";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  // Validate Video ID
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID.");
  }

  // Check if video exists
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found.");
  }

  // Check if user has already liked the video
  const existingLike = await Like.findOne({
    video: videoId,
    likeBy: req.user._id,
  });

  // Unlike the video
  if (existingLike) {
    await existingLike.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Video unliked successfully."));
  }

  // Like the video
  const like = await Like.create({
    video: videoId,
    likeBy: req.user._id,
  });

  if (!like) {
    throw new ApiError(500, "Failed to like the video.");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, like, "Video liked successfully."));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  // Validate Comment ID
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(400, "Invalid comment ID.");
  }

  // Check if comment exists
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found.");
  }

  // Check if user has already liked the comment
  const existingLike = await Like.findOne({
    comment: commentId,
    likeBy: req.user._id,
  });

  // Unlike the comment
  if (existingLike) {
    await existingLike.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Comment unliked successfully."));
  }

  // Like the comment
  const like = await Like.create({
    comment: commentId,
    likeBy: req.user._id,
  });

  if (!like) {
    throw new ApiError(500, "Failed to like the comment.");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, like, "Comment liked successfully."));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  // Validate Tweet ID
  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID.");
  }

  // Check if tweet exists
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Tweet not found.");
  }

  // Check if user has already liked the tweet
  const existingLike = await Like.findOne({
    tweet: tweetId,
    likeBy: req.user._id,
  });

  // Unlike the tweet
  if (existingLike) {
    await existingLike.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Tweet unliked successfully."));
  }

  // Like the tweet
  const like = await Like.create({
    tweet: tweetId,
    likeBy: req.user._id,
  });

  if (!like) {
    throw new ApiError(500, "Failed to like the tweet.");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, like, "Tweet liked successfully."));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  // Aggregate Pipeline
  const pipeline = [
    {
      $match: {
        likeBy: new mongoose.Types.ObjectId(req.user._id),
        video: { $ne: null },
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "video",
      },
    },
    {
      $unwind: "$video",
    },
    {
      $replaceRoot: {
        newRoot: "$video",
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

  // Fetch Liked Videos
  const likedVideos = await Like.aggregatePaginate(
    Like.aggregate(pipeline),
    options
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, likedVideos, "Liked videos fetched successfully.")
    );
});

export { toggleVideoLike, toggleCommentLike, toggleTweetLike, getLikedVideos };
