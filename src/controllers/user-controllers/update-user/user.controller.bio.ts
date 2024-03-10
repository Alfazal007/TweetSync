import { Request, Response } from "express";
import { asyncHandler } from "../../../utils/AsyncHandler";
import { ApiResponse } from "../../../utils/ApiResponse";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const updateBio = asyncHandler(async (req: Request, res: Response) => {
    const userData = req.body;
    if (!userData.bio || userData.bio.length < 5) {
        return res
            .status(403)
            .json(new ApiResponse(403, "Provide new proper bio", {}));
    }
    let updatedUser;
    try {
        updatedUser = await prisma.user.update({
            where: {
                id: req.user.id,
            },
            data: {
                bio: userData.bio,
            },
            select: {
                username: true,
                email: true,
                profilePic: true,
                banner: true,
                fullName: true,
                refreshToken: true,
                bio: true,
            },
        });
    } catch (err) {
        return res.status(500).json(new ApiResponse(500, "Server error", {}));
    }
    return res
        .status(200)
        .json(new ApiResponse(200, "Bio updated successfully", updatedUser));
});

export { updateBio };
