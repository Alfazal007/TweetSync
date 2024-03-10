import { Router } from "express";
import { createUser } from "../controllers/user-controllers/user.controller.register";
import { upload } from "../middlewares/multer.middleware";
import { login } from "../controllers/user-controllers/user.controller.login";
import { updateFullName } from "../controllers/user-controllers/update-user/user.controller.fullName";
import { isLoggedIn } from "../middlewares/auth.middleware";
import { updateBio } from "../controllers/user-controllers/update-user/user.controller.bio";
const userRouter = Router();

userRouter.route("/register").post(
    upload.fields([
        { name: "profile", maxCount: 1 },
        { name: "banner", maxCount: 1 },
    ]),
    createUser
);

userRouter.route("/login").post(login);
userRouter.route("/update-fullname").put(isLoggedIn, updateFullName);
userRouter.route("/update-bio").put(isLoggedIn, updateBio);
export { userRouter };
