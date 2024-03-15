import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { prisma } from "../../utils/prisma";
import { ApiResponse } from "../../utils/ApiResponse";

const getFollowingTweets = asyncHandler(async (req: Request, res: Response) => {
    const { offset, limit } = req.params;
    const currentUserFollowings = await prisma.user.findFirst({
        where: {
            id: req.user.id,
        },
        select: {
            following: {
                select: {
                    followingId: true,
                },
            },
        },
    });
    if (
        !currentUserFollowings?.following ||
        currentUserFollowings?.following.length < 1
    ) {
        return res
            .status(200)
            .json(new ApiResponse(200, "Follow others to see their posts", {}));
    }
    const followings = currentUserFollowings?.following.map(
        (f) => f.followingId
    );
    followings.push(req.user.id);
    const tweetsFollowing = await prisma.tweet.findMany({
        where: {
            authorId: {
                in: followings,
            },
        },
        orderBy: {
            createdAt: "desc",
        },
        skip: parseInt(offset) * parseInt(limit),
        take: parseInt(limit),
    });
    return res
        .status(200)
        .json(new ApiResponse(200, "Fetched tweets", tweetsFollowing));
});

export { getFollowingTweets };
