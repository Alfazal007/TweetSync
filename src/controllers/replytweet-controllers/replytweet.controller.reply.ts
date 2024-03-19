import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";

const createReply = asyncHandler(async (req: Request, res: Response) => {
    return res.status(200).json({ message: "Create reply" });
});
export { createReply };
