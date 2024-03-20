import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { ApiError } from "../../utils/ApiError";
import { prisma } from "../../utils/prisma";
import { ApiResponse } from "../../utils/ApiResponse";

const unlikeReply = asyncHandler(async (req: Request, res: Response) => {
    const { replyId } = req.body;
    if (!replyId) {
        return res.status(404).json(new ApiError(404, "Reply not found", []));
    }

    const reply = await prisma.replytweet.findFirst({
        where: {
            id: replyId,
        },
        select: {
            id: true,
            content: true,
            LikesReply: {
                select: {
                    userId: true,
                },
            },
        },
    });
    if (!reply) {
        return res.status(404).json(new ApiError(404, "Reply not found", []));
    }
    const liked = reply.LikesReply.map((current) => current.userId);

    if (!liked.includes(req.user.id)) {
        return res
            .status(401)
            .json(new ApiError(401, "You have not liked this reply", []));
    }
    try {
        await prisma.likesReply.deleteMany({
            where: {
                AND: [
                    {
                        replyId: reply.id,
                    },
                    {
                        userId: req.user.id,
                    },
                ],
            },
        });
        return res
            .status(200)
            .json(new ApiResponse(200, "Unlike successful", {}));
    } catch (err) {
        console.log(err);
        return res
            .status(401)
            .json(new ApiError(401, "You have not liked this reply", []));
    }
});
export { unlikeReply };
