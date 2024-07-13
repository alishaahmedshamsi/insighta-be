import { findUserPointsLog } from '../models/pointsLog.model.js';
import { generateResponse, asyncHandler } from '../utils/helpers.js';

export const pointsLogs = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const logs = await findUserPointsLog({ userId: id });
    generateResponse(logs, "Points logs fetched successfully", res);
})