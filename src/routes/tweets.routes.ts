import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware";
import { createTweet } from "../controllers/tweets-controllers/tweets.controller.createTweet";
import { upload } from "../middlewares/multer.middleware";
import { deleteTweet } from "../controllers/tweets-controllers/tweets.controller.deleteTweet";
import { getUserTweets } from "../controllers/tweets-controllers/tweets.controller.getUserTweets";
import { getFollowingTweets } from "../controllers/tweets-controllers/tweets.controller.getFollowingTweets";
import { getTweetFromId } from "../controllers/tweets-controllers/tweets.controller.tweetFromId";
const tweetsRouter = Router();

tweetsRouter
    .route("/create")
    .post(isLoggedIn, upload.single("media"), createTweet);

tweetsRouter.route("/delete").delete(isLoggedIn, deleteTweet);
tweetsRouter
    .route("/user/:userId/offset/:offset/limit/:limit")
    .get(isLoggedIn, getUserTweets);
tweetsRouter
    .route("/user-following/offset/:offset/limit/:limit")
    .get(isLoggedIn, getFollowingTweets);

tweetsRouter.route("/get-tweet/:tweetId").get(isLoggedIn, getTweetFromId);
export { tweetsRouter };
