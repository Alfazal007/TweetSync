import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { prisma } from "../../utils/prisma";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";

const follow = asyncHandler(async (req: Request, res: Response) => {
    const followerId = req.user.id; // does exist because verified in the middleware
    const { followingId } = req.body; // check if it does exist and followerId does not already follow this account
    let followingPerson;

    if (followerId == followingId) {
        return res
            .status(400)
            .json(new ApiError(400, "You cannot follow yourself", []));
    }
    try {
        followingPerson = await prisma.user.findFirst({
            where: {
                id: followingId,
            },
        });
    } catch (err) {
        return res
            .status(400)
            .json(new ApiError(400, "User does not exist", []));
    }
    if (!followingPerson) {
        return res
            .status(400)
            .json(new ApiError(400, "User does not exist", []));
    }
    const followingRelationship = await prisma.following.findFirst({
        where: {
            AND: [
                { followersId: req.user.id },
                { followingId: followingPerson.id },
            ],
        },
    });
    if (followingRelationship) {
        return res
            .status(400)
            .json(new ApiError(400, "You already follow him", []));
    }
    try {
        const newFollowing = await prisma.following.create({
            data: {
                followersId: req.user.id,
                followingId: followingId,
            },
        });
    } catch (err) {
        return res
            .status(400)
            .json(
                new ApiError(
                    400,
                    "There was an error while trying to follow the user",
                    []
                )
            );
    }
    return res.status(200).json(new ApiResponse(200, "Following!!", {}));
});

export { follow };
