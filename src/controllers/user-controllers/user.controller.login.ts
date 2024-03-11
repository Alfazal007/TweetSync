import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { ApiError } from "../../utils/ApiError";
import { comparePassword } from "../../utils/hashPassword";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../../utils/generateTokens";
import { ApiResponse } from "../../utils/ApiResponse";
import { prisma } from "../../utils/prisma";

const login = asyncHandler(async (req: Request, res: Response) => {
    const userData = {
        username: req.body.username || "",
        email: req.body.email || "",
        password: req.body.password,
    };
    if (!userData.password || (!userData.username && !userData.email)) {
        return res
            .status(411)
            .json(
                new ApiError(411, "Did not provide enough information to login")
            );
    }
    const userFromDb = await prisma.user.findFirst({
        where: {
            OR: [{ username: userData.username }, { email: userData.email }],
        },
    });
    if (!userFromDb) {
        return res
            .status(411)
            .json(new ApiError(411, "No user with this credentials found"));
    }
    const passwordMatch = await comparePassword(
        userData.password,
        userFromDb.password
    );
    if (!passwordMatch) {
        return res.status(411).json(new ApiError(411, "Password incorrect"));
    }
    const accessToken = generateAccessToken({
        userId: userFromDb.id,
        username: userFromDb.username,
        email: userFromDb.email,
    });
    const refreshToken = generateRefreshToken(userFromDb.id);
    const options = {
        httpOnly: true,
        secure: true,
    };
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, "Login successful", {
                accessToken: accessToken,
                refreshToken: refreshToken,
            })
        );
});

export { login };
