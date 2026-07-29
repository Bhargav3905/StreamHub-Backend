import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  toggleVideoLike,
  toggleCommentLike,
  toggleTweetLike,
  getLikedVideos,
} from "../controllers/like.controller.js";

const router = Router();

// Protected Routes
router.use(verifyJWT);

// Get all liked videos
router.route("/videos").get(getLikedVideos);

// Toggle likes
router.route("/toggle/video/:videoId").post(toggleVideoLike);

router.route("/toggle/comment/:commentId").post(toggleCommentLike);

router.route("/toggle/tweet/:tweetId").post(toggleTweetLike);

export default router;
