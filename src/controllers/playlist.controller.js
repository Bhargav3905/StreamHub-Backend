import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  // Validate Input
  if (!name?.trim() || !description?.trim()) {
    throw new ApiError(400, "Playlist name and description are required.");
  }

  // Create Playlist
  const playlist = await Playlist.create({
    name: name.trim(),
    description: description.trim(),
    creator: req.user._id,
  });

  if (!playlist) {
    throw new ApiError(500, "Failed to create playlist.");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, playlist, "Playlist created successfully."));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Validate User ID
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user ID.");
  }

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  // Fetch User Playlists
  const playlists = await Playlist.find({
    creator: userId,
  }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, playlists, "User playlists fetched successfully.")
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  // Validate Playlist ID
  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(400, "Invalid playlist ID.");
  }

  // Fetch Playlist
  const playlist = await Playlist.findById(playlistId)
    .populate("videos")
    .populate("creator", "username fullName avatar");

  if (!playlist) {
    throw new ApiError(404, "Playlist not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully."));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;

  // Validate Playlist ID
  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(400, "Invalid playlist ID.");
  }

  // Find Playlist
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found.");
  }

  // Check Ownership
  if (playlist.creator.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this playlist.");
  }

  // Validate Input
  if (!name?.trim() || !description?.trim()) {
    throw new ApiError(400, "Playlist name and description are required.");
  }

  // Update Playlist
  playlist.name = name.trim();
  playlist.description = description.trim();

  await playlist.save();
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist updated successfully."));
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  // Validate Playlist ID
  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(400, "Invalid playlist ID.");
  }

  // Find Playlist
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found.");
  }

  // Check Ownership
  if (playlist.creator.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this playlist.");
  }

  // Delete Playlist
  await playlist.deleteOne();
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Playlist deleted successfully."));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  // Validate IDs
  if (
    !mongoose.Types.ObjectId.isValid(playlistId) ||
    !mongoose.Types.ObjectId.isValid(videoId)
  ) {
    throw new ApiError(400, "Invalid playlist ID or video ID.");
  }

  // Check if playlist exists
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found.");
  }

  // Check if video exists
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found.");
  }

  // Check ownership
  if (playlist.creator.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to modify this playlist.");
  }

  // Prevent duplicate videos
  const alreadyExists = playlist.videos.some((id) => id.toString() === videoId);
  if (alreadyExists) {
    throw new ApiError(400, "Video already exists in the playlist.");
  }

  // Add video to playlist
  playlist.videos.push(videoId);
  await playlist.save();
  return res
    .status(200)
    .json(
      new ApiResponse(200, playlist, "Video added to playlist successfully.")
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  // Validate IDs
  if (
    !mongoose.Types.ObjectId.isValid(playlistId) ||
    !mongoose.Types.ObjectId.isValid(videoId)
  ) {
    throw new ApiError(400, "Invalid playlist ID or video ID.");
  }

  // Check if playlist exists
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found.");
  }

  // Check if video exists
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found.");
  }

  // Check ownership
  if (playlist.creator.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to modify this playlist.");
  }

  // Check if video exists in playlist
  const videoExists = playlist.videos.some((id) => id.toString() === videoId);
  if (!videoExists) {
    throw new ApiError(404, "Video not found in the playlist.");
  }

  // Remove video from playlist
  playlist.videos.pull(videoId);
  await playlist.save();
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        playlist,
        "Video removed from playlist successfully."
      )
    );
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
};
