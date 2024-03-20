import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { prisma } from "../../utils/prisma";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";

const createReply = asyncHandler(async (req: Request, res: Response) => {
    const { tweetId, reply } = req.body;
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
        },
    });
    if (!tweet) {
        return res.status(404).json(new ApiError(404, "Tweet not found", []));
    }
    try {
        const replyTweet = await prisma.replytweet.create({
            data: {
                content: reply,
                tweetId: tweetId,
                userId: req.user.id,
            },
            select: {
                content: true,
                tweet: {
                    select: {
                        content: true,
                        _count: {
                            select: {
                                Likestweet: true,
                            },
                        },
                        Replytweet: true,
                    },
                },
            },
        });
        return res
            .status(200)
            .json(new ApiResponse(200, "Sent the reply", replyTweet));
    } catch (error) {
        return res
            .status(500)
            .json(
                new ApiError(
                    500,
                    "Internal server error while replying to tweet",
                    []
                )
            );
    }
});
export { createReply };
