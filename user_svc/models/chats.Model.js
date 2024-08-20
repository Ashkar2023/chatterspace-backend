import mongoose, { Schema, Types } from "mongoose";

const userChatSchema = new Schema({
    userId:{
        type:Types.ObjectId,
        required:[true, "Can't connect chats to user without UserID"]
    },
    privateChats:[],
    GroupChats:[],
})

const privateChatSchema = new Schema({
    user:{
        type:Types.ObjectId,
        required:[true,"userId of Rnot provided "]
    }
})