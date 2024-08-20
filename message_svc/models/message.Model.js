import { Schema, model } from "mongoose";

const messageSchema = new Schema({
    sender: {
        type: String,
        required: [true, 'Sender is required'],
    },
    receiver: {
        type: String,
        required: [true, 'Receiver is required'],
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
    },
    type: {
        type: String,
        enum: {
            values: ['text', 'image', 'file', 'audio', 'URL'],
            message: 'Type must be one of: text, image, file, audio, URL'
        },
        required: [true, 'Type is required'],
    },
    sentAt:{
        type:Date,
        required:[true, "sentAt TimeStamp not provided"]
    },
    delivered:Date,
    metadata: {}
    
}, { timestamps: true });

export default model('messages', messageSchema);
