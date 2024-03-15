import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { prisma } from "../../utils/prisma";
import { ApiResponse } from "../../utils/ApiResponse";

const getUserTweets = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { offset, limit } = req.params;
    const tweets = await prisma.tweet.findMany({
        where: {
            authorId: userId,
        },
        select: {
            authorId: true,
            content: true,
            media: true,
            id: true,
            createdAt: true,
            _count: {
                select: {
                    Replytweet: true,
                    Likestweet: true,
                },
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
        .json(new ApiResponse(200, "Tweets found = " + tweets.length, tweets));
});

export { getUserTweets };
