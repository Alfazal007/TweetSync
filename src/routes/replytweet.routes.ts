import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware";
import { createReply } from "../controllers/replytweet-controllers/replytweet.controller.reply";
import { deleteReply } from "../controllers/replytweet-controllers/replytweet.controller.deletereply";
const replyTweet = Router();

replyTweet.route("/add-reply").post(isLoggedIn, createReply);
replyTweet.route("/delete-reply").delete(isLoggedIn, deleteReply);

export { replyTweet };
