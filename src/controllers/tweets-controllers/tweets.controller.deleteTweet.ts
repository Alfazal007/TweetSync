import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { ApiError } from "../../utils/ApiError";
import { prisma } from "../../utils/prisma";
import { ApiResponse } from "../../utils/ApiResponse";
import { deleteFromCloudinary } from "../../utils/deleteFromCloudinary";

const deleteTweet = asyncHandler(async (req: Request, res: Response) => {
    const { tweetId } = req.body;
    if (!tweetId) {
        return res
            .status(401)
            .json(new ApiError(401, "Specify the tweet to be deleted", []));
    }
    const tweetToBeDeleted = await prisma.tweet.findFirst({
        where: {
            id: tweetId,
        },
    });
    if (!tweetToBeDeleted) {
        return res
            .status(401)
            .json(new ApiError(401, "No tweet found with this id", []));
    }
    if (tweetToBeDeleted.authorId != req.user.id) {
        return res
            .status(401)
            .json(new ApiError(401, "You cannot delete others tweets", []));
    }
    try {
        if (tweetToBeDeleted.media) {
            await deleteFromCloudinary(tweetToBeDeleted.media);
        }
        await prisma.tweet.delete({
            where: {
                id: tweetId,
            },
        });
    } catch (error) {
        return res
            .status(500)
            .json(new ApiError(500, "There was an error", []));
    }
    return res
        .status(200)
        .json(new ApiResponse(200, "Tweet has been deleted successfully", {}));
});

export { deleteTweet };
