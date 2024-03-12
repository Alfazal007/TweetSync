import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware";
import { follow } from "../controllers/following-controllers/following.controller.follow";
import { unfollow } from "../controllers/following-controllers/following.controller.unfollow";
const followRouter = Router();

followRouter.route("/follow").post(isLoggedIn, follow);
followRouter.route("/unfollow").post(isLoggedIn, unfollow);
export { followRouter };
