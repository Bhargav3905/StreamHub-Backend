import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query,
    sortBy = "createdAt",
    sortType = "desc",
    userId,
  } = req.query;

  // Pagination
  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  // Aggregation Pipeline
  const pipeline = [];

  // Show only published videos
  pipeline.push({
    $match: {
      isPublished: true,
    },
  });

  // Search by title or description
  if (query) {
    pipeline.push({
      $match: {
        $or: [
          {
            title: {
              $regex: query,
              $options: "i",
            },
          },
          {
            description: {
              $regex: query,
              $options: "i",
            },
          },
        ],
      },
    });
  }

  // Filter by channel(owner)
  if (userId && mongoose.Types.ObjectId.isValid(userId)) {
    pipeline.push({
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    });
  }

  // Sorting
  pipeline.push({
    $sort: {
      [sortBy]: sortType === "asc" ? 1 : -1,
    },
  });

  // Aggregate Pagination
  const options = {
    page: pageNumber,
    limit: limitNumber,
  };

  const videos = await Video.aggregatePaginate(
    Video.aggregate(pipeline),
    options
  );

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully."));
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  // Validate required fields
  if (!title?.trim() || !description?.trim()) {
    throw new ApiError(400, "Title and description are required.");
  }

  // Get local file paths
  const videoLocalPath = req.files?.videoFile?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  if (!videoLocalPath) {
    throw new ApiError(400, "Video file is required.");
  }

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail is required.");
  }

  // Upload to Cloudinary
  const videoFile = await uploadOnCloudinary(videoLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!videoFile) {
    throw new ApiError(500, "Failed to upload video.");
  }

  if (!thumbnail) {
    throw new ApiError(500, "Failed to upload thumbnail.");
  }

  // Create video document
  const video = await Video.create({
    videoFile: videoFile.secure_url,
    thumbnail: thumbnail.secure_url,
    title,
    description,
    duration: videoFile.duration || 0,
    owner: req.user._id,
  });

  if (!video) {
    throw new ApiError(500, "Failed to publish video.");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, video, "Video published successfully."));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video id.");
  }

  const video = await Video.findById(videoId).populate(
    "owner",
    "fullName username avatar"
  );

  if (!video) {
    throw new ApiError(404, "Video not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully."));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description, isPublished } = req.body;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video id.");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found.");
  }

  // Only owner can update
  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this video.");
  }

  // Update thumbnail if provided
  if (req.file?.path) {
    const thumbnail = await uploadOnCloudinary(req.file.path);

    if (!thumbnail) {
      throw new ApiError(500, "Thumbnail upload failed.");
    }

    video.thumbnail = thumbnail.secure_url;
  }

  // Update fields if provided
  if (title?.trim()) video.title = title;
  if (description?.trim()) video.description = description;
  if (typeof isPublished !== "undefined") {
    video.isPublished = isPublished;
  }

  await video.save();

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video updated successfully."));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video id.");
  }

  // Find video
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found.");
  }

  // Authorization
  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this video.");
  }

  // Delete video
  await Video.findByIdAndDelete(videoId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted successfully."));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video id.");
  }

  // Find video
  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found.");
  }

  // Authorization
  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this video.");
  }

  // Toggle publish status
  video.isPublished = !video.isPublished;

  await video.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        video,
        `Video ${video.isPublished ? "published" : "unpublished"} successfully.`
      )
    );
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
