import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { prisma } from "../../utils/prisma";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";

const getUserById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userFromDb = await prisma.user.findFirst({
        where: {
            id: id,
        },
        select: {
            banner: true,
            profilePic: true,
            email: true,
            fullName: true,
            followers: true,
            following: true,
            isVerified: true,
            username: true,
            id: true,
            bio: true,
            Tweet: true,
        },
    });
    if (!userFromDb) {
        return res.status(404).json(new ApiError(404, "User not found", []));
    }
    return res
        .status(200)
        .json(new ApiResponse(200, "Found User with id", userFromDb));
});

export { getUserById };
