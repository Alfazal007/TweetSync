import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { prisma } from "../../utils/prisma";
import { ApiResponse } from "../../utils/ApiResponse";

const logout = asyncHandler(async (req: Request, res: Response) => {
    await prisma.user.update({
        where: {
            id: req.user.id,
        },
        data: {
            refreshToken: "",
        },
    });
    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                "User successfully logged out of the system",
                {}
            )
        );
});

export { logout };
