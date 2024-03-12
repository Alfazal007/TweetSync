import { Router } from "express";
import { createUser } from "../controllers/user-controllers/user.controller.register";
import { upload } from "../middlewares/multer.middleware";
import { login } from "../controllers/user-controllers/user.controller.login";
import { updateFullName } from "../controllers/user-controllers/update-user/user.controller.fullName";
import { isLoggedIn } from "../middlewares/auth.middleware";
import { updateBio } from "../controllers/user-controllers/update-user/user.controller.bio";
import { updateProfile } from "../controllers/user-controllers/update-user/user.controller.profile";
import { updateBanner } from "../controllers/user-controllers/update-user/user.controller.banner";
import { changePassword } from "../controllers/user-controllers/update-user/user.controller.changePassword";
import { logout } from "../controllers/user-controllers/user.controller.logout";
import {
    forgotPasswordGenerateLink,
    handleResetToken,
} from "../controllers/user-controllers/user.controller.forgot-password";
import { deleteUser } from "../controllers/user-controllers/user.controller.delete.-user";
import { getUserById } from "../controllers/user-controllers/user.controller.findById";
import { getUserByUsername } from "../controllers/user-controllers/user.controller.findByUsername";
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
userRouter
    .route("/update-profile")
    .put(isLoggedIn, upload.single("profile"), updateProfile);
userRouter
    .route("/update-banner")
    .put(isLoggedIn, upload.single("banner"), updateBanner);
userRouter.route("/change-password").put(isLoggedIn, changePassword);
userRouter.route("/logout").post(isLoggedIn, logout);
userRouter.route("/forgot-password").post(forgotPasswordGenerateLink);
userRouter.route("/new-password/:userId/:token").post(handleResetToken);
userRouter.route("/delete").delete(isLoggedIn, deleteUser);
userRouter.route("/get-user/:id").get(isLoggedIn, getUserById);
userRouter
    .route("/get-user/username/:username")
    .get(isLoggedIn, getUserByUsername);

export { userRouter };
