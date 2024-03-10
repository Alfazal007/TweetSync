import { Request, Response } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { registerUserSchema } from "../utils/ZodValidators";
import { PrismaClient } from "@prisma/client";
import { ApiError } from "../utils/ApiError";
import { uploadOnCloudinary } from "../utils/uploadToCloudinary";
import { deleteFromCloudinary } from "../utils/deleteFromCloudinary";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../utils/generateTokens";
import { generateHashPassword } from "../utils/hashPassword";

const prisma = new PrismaClient();

const createUser = asyncHandler(async (req: Request, res: Response) => {
    const userData = {
        fullName: req.body.fullName,
        username: req.body.username,
        email: req.body.email,
        bio: req.body.bio,
        isVerified: false,
        password: req.body.password,
        profilePic: "",
        banner: "",
    };
    const result = registerUserSchema.safeParse(userData);
    if (!result.success) {
        return res
            .status(411)
            .json(new ApiError(411, `Invalid user inputs ${result.error}`));
    }
    const userWithSameCredentials = await prisma.user.findFirst({
        where: {
            OR: [{ username: userData.username }, { email: userData.email }],
        },
    });
    if (userWithSameCredentials) {
        return res
            .status(411)
            .json(
                new ApiError(
                    411,
                    `User with same credentials exist try different username and/or email`
                )
            );
    }
    if (
        req.files &&
        (Array.isArray(req.files) ||
            (typeof req.files === "object" &&
                req.files.profile &&
                Array.isArray(req.files.profile) &&
                req.files.profile.length > 0))
    ) {
        const files = Array.isArray(req.files) ? req.files : req.files.profile;
        let profilePicPath = files[0].path;
        const profilePicResponse = await uploadOnCloudinary(profilePicPath);
        if (profilePicResponse == null) {
            return res
                .status(500)
                .json(new ApiError(500, `Failed to upload profile picture`));
        }
        userData.profilePic = profilePicResponse?.url || "";
    }
    if (
        req.files &&
        (Array.isArray(req.files) ||
            (typeof req.files === "object" &&
                req.files.banner &&
                Array.isArray(req.files.banner) &&
                req.files.banner.length > 0))
    ) {
        const files = Array.isArray(req.files) ? req.files : req.files.banner;
        let bannerPath = files[0].path;
        const bannerPicResponse = await uploadOnCloudinary(bannerPath);
        if (bannerPicResponse == null) {
            if (userData.profilePic) {
                await deleteFromCloudinary(userData.profilePic);
            }
            return res
                .status(500)
                .json(new ApiError(500, `Failed to upload banner picture`));
        }
        userData.banner = bannerPicResponse?.url || "";
    }
    const hashedPassword = await generateHashPassword(userData.password);
    userData.password = hashedPassword;
    // save the user
    let savedUser;
    try {
        savedUser = await prisma.user.create({
            data: userData,
        });
    } catch (err) {
        // delete from cloudinary and return
        if (userData.profilePic) {
            await deleteFromCloudinary(userData.profilePic);
        }
        if (userData.banner) {
            await deleteFromCloudinary(userData.banner);
        }
    }

    // create refresh token and access token
    const accessToken = generateAccessToken({
        userId: savedUser?.id || "",
        username: savedUser?.username || "",
        email: savedUser?.email || "",
    });
    const refreshToken = generateRefreshToken(savedUser?.id || "");
    const userSaved = await prisma.user.update({
        where: {
            id: savedUser?.id || "",
        },
        data: {
            refreshToken: refreshToken,
        },
        select: {
            username: true,
            email: true,
            profilePic: true,
            banner: true,
            fullName: true,
            refreshToken: true,
        },
    });
    const options = {
        httpOnly: true,
        secure: true,
    };
    return res
        .status(200)
        .cookie("Access token", accessToken, options)
        .cookie("Refresh token", refreshToken, options)
        .json(
            new ApiResponse(200, "Exposed endpoint", {
                userdata: userSaved,
                accessToken: accessToken,
            })
        );
});

export { createUser };
