import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { ApiError } from "../../utils/ApiError";
import { prisma } from "../../utils/prisma";
import { ApiResponse } from "../../utils/ApiResponse";

const getTweetFromId = asyncHandler(async (req: Request, res: Response) => {
    const { tweetId } = req.params;
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
            _count: {
                select: {
                    Likestweet: true,
                },
            },
            Replytweet: true,
            author: {
                select: {
                    fullName: true,
                    username: true,
                    id: true,
                },
            },
            createdAt: true,
            updatedAt: true,
        },
    });
    if (!tweet) {
        return res.status(404).json(new ApiError(404, "Tweet not found", []));
    }
    return res.status(200).json(new ApiResponse(200, "Found the tweet", tweet));
});

export { getTweetFromId };
