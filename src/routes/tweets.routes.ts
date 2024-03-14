import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware";
import { createTweet } from "../controllers/tweets-controllers/tweets.controller.createTweet";
import { upload } from "../middlewares/multer.middleware";
import { deleteTweet } from "../controllers/tweets-controllers/tweets.controller.deleteTweet";
const tweetsRouter = Router();

tweetsRouter
    .route("/create")
    .post(isLoggedIn, upload.single("media"), createTweet);

tweetsRouter.route("/delete").delete(isLoggedIn, deleteTweet);

export { tweetsRouter };
