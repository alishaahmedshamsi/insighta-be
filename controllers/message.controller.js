import { findMessage, sendMessage } from "../models/message.model.js";
import { asyncHandler,generateResponse } from "../utils/helpers.js";

export const sendMessages = asyncHandler(async (req, res) => {
    req.body.user = req.user.id;
    
    const message = await sendMessage(req.body);
    generateResponse(message, "Message sent successfully", res);
});

export const fetchMessages = asyncHandler(async (req, res) => {
    const messages = await findMessage({ chat: req.params.id });
    generateResponse(messages, "Messages fetched successfully", res);
});