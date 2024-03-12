import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { prisma } from "../../utils/prisma";
import { ApiResponse } from "../../utils/ApiResponse";

const deleteUser = asyncHandler(async (req: Request, res: Response) => {
    try {
        const deleteUser = await prisma.user.delete({
            where: {
                id: req.user.id,
            },
        });
    } catch (error) {
        return res
            .status(403)
            .json(
                new ApiResponse(
                    403,
                    "There was some issue deleting the user from DB",
                    []
                )
            );
    }
    return res
        .status(200)
        .json(new ApiResponse(200, "Deleted user from DB successfully", {}));
});

export { deleteUser };
