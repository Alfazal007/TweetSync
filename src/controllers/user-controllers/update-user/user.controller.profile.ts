import { Request, Response } from "express";
import { asyncHandler } from "../../../utils/AsyncHandler";
import { ApiError } from "../../../utils/ApiError";
import { prisma } from "../../../utils/prisma";
import { deleteFromCloudinary } from "../../../utils/deleteFromCloudinary";
import { uploadOnCloudinary } from "../../../utils/uploadToCloudinary";
import { ApiResponse } from "../../../utils/ApiResponse";

const updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const profileLocalPath = req.file?.path;
    if (!profileLocalPath) {
        return res
            .status(401)
            .json(
                new ApiError(401, "Provide a valid image to be uploaded", [])
            );
    }
    const userToUpdate = await prisma.user.findFirst({
        where: {
            id: req.user.id,
        },
    });
    if (!userToUpdate) {
        return res.status(401).json(new ApiError(404, "User not found", []));
    }
    const toBeDeletedUrl = userToUpdate.profilePic;
    if (toBeDeletedUrl) {
        const deleted = await deleteFromCloudinary(toBeDeletedUrl);
    }
    const uploadedUrl = await uploadOnCloudinary(profileLocalPath);
    const newUpdatedUser = await prisma.user.update({
        where: {
            id: req.user.id,
        },
        data: {
            profilePic: uploadedUrl?.url,
        },
        select: {
            id: true,
            fullName: true,
            username: true,
            profilePic: true,
            banner: true,
            email: true,
            bio: true,
        },
    });
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Profile picture updated succecssfully",
                newUpdatedUser
            )
        );
});

export { updateProfile };
