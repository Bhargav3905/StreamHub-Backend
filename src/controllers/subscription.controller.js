import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  // Validate Channel ID
  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new ApiError(400, "Invalid channel ID.");
  }

  // Check if channel exists
  const channel = await User.findById(channelId);
  if (!channel) {
    throw new ApiError(404, "Channel not found.");
  }

  // Prevent self-subscription
  if (channel._id.toString() === req.user._id.toString()) {
    throw new ApiError(400, "You cannot subscribe to yourself.");
  }

  // Check if already subscribed
  const existingSubscription = await Subscription.findOne({
    subscriber: req.user._id,
    channel: channelId,
  });

  // Unsubscribe
  if (existingSubscription) {
    await existingSubscription.deleteOne();

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Channel unsubscribed successfully."));
  }

  // Subscribe
  const subscription = await Subscription.create({
    subscriber: req.user._id,
    channel: channelId,
  });

  if (!subscription) {
    throw new ApiError(500, "Failed to subscribe to the channel.");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, subscription, "Channel subscribed successfully.")
    );
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  // Validate Channel ID
  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new ApiError(400, "Invalid channel ID.");
  }

  // Check if channel exists
  const channel = await User.findById(channelId);
  if (!channel) {
    throw new ApiError(404, "Channel not found.");
  }

  // Aggregate Pipeline
  const pipeline = [
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriber",
      },
    },
    {
      $unwind: "$subscriber",
    },
    {
      $project: {
        "subscriber.username": 1,
        "subscriber.fullName": 1,
        "subscriber.avatar": 1,
      },
    },
  ];

  // Pagination Options
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };

  // Fetch Subscribers
  const subscribers = await Subscription.aggregatePaginate(
    Subscription.aggregate(pipeline),
    options
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscribers,
        "Channel subscribers fetched successfully."
      )
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  // Validate Subscriber ID
  if (!mongoose.Types.ObjectId.isValid(subscriberId)) {
    throw new ApiError(400, "Invalid subscriber ID.");
  }

  // Check if subscriber exists
  const subscriber = await User.findById(subscriberId);

  if (!subscriber) {
    throw new ApiError(404, "Subscriber not found.");
  }

  // Aggregate Pipeline
  const pipeline = [
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(subscriberId),
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channel",
      },
    },
    {
      $unwind: "$channel",
    },
    {
      $project: {
        "channel.username": 1,
        "channel.fullName": 1,
        "channel.avatar": 1,
      },
    },
  ];

  // Pagination Options
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };

  // Fetch Subscribed Channels
  const subscribedChannels = await Subscription.aggregatePaginate(
    Subscription.aggregate(pipeline),
    options
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscribedChannels,
        "Subscribed channels fetched successfully."
      )
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
