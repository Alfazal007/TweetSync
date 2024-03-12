import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../../utils/generateTokens";
import { ApiError } from "../../utils/ApiError";
import { prisma } from "../../utils/prisma";
import { ApiResponse } from "../../utils/ApiResponse";
import jwt, { JwtPayload } from "jsonwebtoken";

const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
    let refreshToken =
        req.cookies.refreshToken || req.headers.authorization || "";
    if (!refreshToken) {
        return res
            .status(403)
            .json(new ApiError(403, "Forbidden request! Re-login"));
    }
    if (refreshToken.startsWith("Bearer ")) {
        refreshToken = refreshToken.replace("Bearer ", "");
    }
    let userInfo;
    try {
        userInfo = jwt.verify(
            refreshToken,
            process.env.REFRESHTOKENSECRET || ""
        ) as JwtPayload;
    } catch (error) {
        if (!userInfo) {
            return res
                .status(403)
                .json(
                    new ApiError(403, "Forbidden request! Re-login Invalid jwt")
                );
        }
    }
    const userFromDb = await prisma.user.findFirst({
        where: {
            id: userInfo.id,
        },
        select: {
            id: true,
            username: true,
            email: true,
        },
    });
    if (!userFromDb) {
        return res
            .status(403)
            .json(
                new ApiError(
                    403,
                    "Forbidden request! Re-login Invalid jwt user not found with these credentials"
                )
            );
    }

    const newAccessToken = generateAccessToken({
        email: userFromDb.email,
        username: userFromDb.username,
        userId: userFromDb.id,
    });
    const newRefreshToken = generateRefreshToken(userFromDb.id);
    try {
        await prisma.user.update({
            where: {
                id: userFromDb.id,
            },
            data: {
                refreshToken: newRefreshToken,
            },
        });
    } catch (error) {
        return res
            .status(500)
            .json(new ApiError(500, "Some error! Try again later", []));
    }
    const options = {
        httpOnly: true,
        secure: true,
    };
    return res
        .status(200)
        .cookie("accessToken", newAccessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(200, "Successfully updated tokens", {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            })
        );
});

export { refreshAccessToken };
