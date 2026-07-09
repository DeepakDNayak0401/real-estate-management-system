import express from "express";
import Chat from "../models/chat.model.js";
import { protect } from "../middlewares/auth.middleware.js";

const chatRouter = express.Router();
chatRouter.use(protect);

chatRouter.post("/", async (req, res) => {
    try {
        const { propertyId, sellerId, buyerId: providedBuyerId } = req.body;
        let buyerId, finalSellerId;
        if (req.user.role === "seller") {
            finalSellerId = req.user.id;
            buyerId = providedBuyerId;
        } else {
            buyerId = req.user.id;
            finalSellerId = sellerId;
        }

        if (!buyerId || !finalSellerId) {
            return res.status(400).json({ message: "Missing required fields", success: false });
        }

        //check for an existing chat between the buyer and seller
        let chat = await Chat.findOne({
            buyer: buyerId,
            seller: finalSellerId
        });

        if (!chat) {
            //if no chat exists, create a new one
            chat = await Chat.create({
                property: propertyId,
                buyer: buyerId,
                seller: finalSellerId,
                messages: []
            });
        }
        chat = await Chat.findById(chat._id)
            .populate("buyer", "name email profilePic")
            .populate("seller", "name email profilePic")
            .populate("property", "title price location images");

        res.status(200).json({ chat, success: true });

    } catch (error) {
        res.status(500).json({ message: "Error sending message", error: error.message, success: false });
    }
});


//to send a message in a chat
chatRouter.post("/send", async (req, res) => {
    try {
        const { chatId, text, image } = req.body;
        const userId = req.user.id;

        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: "Chat not found", success: false });
        }

        //ensure that send is part fo the chat
        if (chat.buyer.toString() !== userId && chat.seller.toString() !== userId) {
            return res.status(403).json({ message: "You are not part of this chat", success: false });
        }

        const newMessage = {
            sender: userId,
            text,
            image,
            createdAt: new Date()
        };
        chat.messages.push(newMessage);
        await chat.save();

        const savedMessage = chat.messages[chat.messages.length - 1];
        res.status(200).json({ message: "Message sent successfully", success: true, message: savedMessage });

    } catch (error) {
        res.status(500).json({ message: "Error sending message", error: error.message, success: false });
    }
});


//to get all chats for a user
chatRouter.get("/", async (req, res) => {
    try {
        const userId = req.user.id;
        const chats = await Chat.find({
            $or: [{ buyer: userId }, { seller: userId }]
        }).populate("buyer", "name email profilePic")
            .populate("seller", "name email profilePic")
            .populate("property", "title price location images")
            .sort({ updatedAt: -1 });
        res.status(200).json({ chats, success: true });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving chats", error: error.message, success: false });
    }
});


//to get chat messages for a specific chat
chatRouter.get("/:chatId", async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.chatId)
            .populate(
                "messages.sender",
                "name profilePic"
            );

        if (!chat) {
            return res.status(404).json({ message: "Chat not found", success: false });
        }

        const userId = req.user.id.toString();
        if (chat.buyer.toString() !== userId && chat.seller.toString() !== userId) {
            return res.status(403).json({ message: "You are not part of this chat", success: false });
        }

        res.status(200).json({ chat, success: true });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving chat", error: error.message, success: false });
    }
});

//to delete a chat
chatRouter.delete("/:chatId", async (req, res) => {
    try {
        const userId = req.user.id;
        const chat = await Chat.findById(req.params.chatId);
        if (!chat) {
            return res.status(404).json({ message: "Chat not found", success: false });
        }
        if (chat.buyer.toString() !== userId && chat.seller.toString() !== userId) {
            return res.status(403).json({ message: "You are not authorized to delete this chat", success: false });
        }
        await Chat.findByIdAndDelete(req.params.chatId);
        res.status(200).json({ message: "Chat deleted successfully", success: true });
    } catch (error) {
        res.status(500).json({ message: "Error deleting chat", error: error.message, success: false });
    }
});


//to delete a specific message in a chat
chatRouter.delete("/:chatId/message/:messageId", async (req, res) => {
    try {
        const userId = req.user.id;
        const chat = await Chat.findById(req.params.chatId);
        if (!chat) {
            return res.status(404).json({ message: "Chat not found", success: false });
        }

        const message = chat.messages.id(req.params.messageId);
        if (!message) {
            return res.status(404).json({ message: "Message not found", success: false });
        }

        //only the sender can delete their message
        if (message.sender.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this message", success: false });
        }

        chat.messages.pull({ _id: req.params.messageId });
        await chat.save();
        res.status(200).json({ message: "Message deleted successfully", success: true });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting message", error: error.message, success: false });
    }
});

export default chatRouter;