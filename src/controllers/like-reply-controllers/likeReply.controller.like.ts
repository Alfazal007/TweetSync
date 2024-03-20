import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { ApiError } from "../../utils/ApiError";
import { prisma } from "../../utils/prisma";
import { ApiResponse } from "../../utils/ApiResponse";

const likeReply = asyncHandler(async (req: Request, res: Response) => {
    const { replyId } = req.body;
    if (!replyId) {
        return res
            .status(403)
            .json(new ApiError(403, "Error finding the reply", []));
    }
    const replyFromDb = await prisma.replytweet.findFirst({
        where: {
            id: replyId,
        },
        select: {
            content: true,
            LikesReply: {
                select: {
                    userId: true,
                },
            },
        },
    });
    if (!replyFromDb) {
        return res
            .status(403)
            .json(new ApiError(403, "Could not find the reply", []));
    }
    const liked = replyFromDb.LikesReply.map((current) => current.userId);
    if (liked.includes(req.user.id)) {
        return res
            .status(401)
            .json(new ApiError(401, "You have already liked this reply", []));
    }
    try {
        await prisma.likesReply.create({
            data: {
                replyId: replyId,
                userId: req.user.id,
            },
        });
        return res
            .status(200)
            .json(new ApiResponse(200, "Liked the reply successfully", {}));
    } catch (err) {
        return res.status(500).json(new ApiError(500, "Server error", []));
    }
});

export { likeReply };
