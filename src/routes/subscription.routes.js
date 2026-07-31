import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels,
} from "../controllers/subscription.controller.js";

const router = Router();

// Protected Routes
router.use(verifyJWT);

// Subscribe / Unsubscribe a Channel
router.route("/channel/:channelId").post(toggleSubscription);

// Get Subscribers of a Channel
router.route("/channel/:channelId").get(getUserChannelSubscribers);

// Get Channels Subscribed by a User
router.route("/subscriber/:subscriberId").get(getSubscribedChannels);

export default router;
