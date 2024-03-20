import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { ApiError } from "../../utils/ApiError";
import { prisma } from "../../utils/prisma";
import { ApiResponse } from "../../utils/ApiResponse";

const deleteReply = asyncHandler(async (req: Request, res: Response) => {
    const { tweetId, replyId } = req.body;
    if (!tweetId || !replyId) {
        return res
            .status(404)
            .json(new ApiError(404, "Tweet not found or reply not found", []));
    }

    const tweet = await prisma.tweet.findFirst({
        where: {
            id: tweetId,
        },
        select: {
            id: true,
            content: true,
            Replytweet: {
                where: {
                    AND: [
                        {
                            userId: req.user.id,
                        },
                        {
                            id: replyId,
                        },
                    ],
                },
                select: {
                    content: true,
                    userId: true,
                },
            },
        },
    });
    if (
        !tweet ||
        tweet.Replytweet.length <= 0 ||
        tweet.Replytweet[0].userId != req.user.id
    ) {
        return res
            .status(404)
            .json(
                new ApiError(
                    404,
                    "Tweet not found or your response was not found or this is not your reply",
                    []
                )
            );
    }
    try {
        await prisma.replytweet.delete({
            where: {
                id: replyId,
            },
        });
        return res
            .status(200)
            .json(new ApiResponse(200, "Deleted the reply successfully", {}));
    } catch (error) {
        return res
            .status(500)
            .json(
                new ApiError(
                    500,
                    "There was an error while deleting the tweet",
                    []
                )
            );
    }
});
export { deleteReply };
