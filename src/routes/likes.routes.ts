import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware";
import { createLikeTweet } from "../controllers/like-tweet-controller/liketweet.controller.like";
import { unlikeTweet } from "../controllers/like-tweet-controller/likeTweet.controller.unlike";
const likeTweetRouter = Router();

likeTweetRouter.route("/like").post(isLoggedIn, createLikeTweet);
likeTweetRouter.route("/unlike").post(isLoggedIn, unlikeTweet);

export { likeTweetRouter };
