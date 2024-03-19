import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";

const deleteReply = asyncHandler(async (req: Request, res: Response) => {
    return res.status(200).json({ message: "Delete reply" });
});
export { deleteReply };
