import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware";
import { likeReply } from "../controllers/like-reply-controllers/likeReply.controller.like";
import { unlikeReply } from "../controllers/like-reply-controllers/likeReply.controller.unlike";

const likeReplyRouter = Router();

likeReplyRouter.route("/like").post(isLoggedIn, likeReply);
likeReplyRouter.route("/unlike").post(isLoggedIn, unlikeReply);

export { likeReplyRouter };
