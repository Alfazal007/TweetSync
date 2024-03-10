import { Router } from "express";
import { createUser } from "../controllers/user-controllers/user.controller.register";
import { upload } from "../middlewares/multer.middleware";
const userRouter = Router();

userRouter.route("/register").post(
    upload.fields([
        { name: "profile", maxCount: 1 },
        { name: "banner", maxCount: 1 },
    ]),
    createUser
);
export { userRouter };
