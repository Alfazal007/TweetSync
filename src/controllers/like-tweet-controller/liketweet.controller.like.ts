import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { prisma } from "../../utils/prisma";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";

const createLikeTweet = asyncHandler(async (req: Request, res: Response) => {
    const { tweetId } = req.body;
    if (!tweetId) {
        return res.status(404).json(new ApiError(404, "Tweet not found", []));
    }

    const tweet = await prisma.tweet.findFirst({
        where: {
            id: tweetId,
        },
        select: {
            id: true,
            content: true,
            Likestweet: {
                select: {
                    userId: true,
                },
            },
        },
    });
    if (!tweet) {
        return res.status(404).json(new ApiError(404, "Tweet not found", []));
    }
    const liked = tweet.Likestweet.map((current) => current.userId);
    if (liked.includes(req.user.id)) {
        return res
            .status(401)
            .json(new ApiError(401, "You have already liked this tweet", []));
    }
    await prisma.likestweet.create({
        data: {
            tweetId,
            userId: req.user.id,
        },
    });

    return res
        .status(200)
        .json(new ApiResponse(200, "Liked the tweet successfully", {}));
});

export { createLikeTweet };
