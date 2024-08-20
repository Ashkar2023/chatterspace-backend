import { model, Schema, Types } from "mongoose";

const chatSchema = new Schema({
    users: {
        type: [Types.ObjectId],
        required: [true, "userId not provided"],
        validate: {
            validator: function (array) {
                return array.length === 2;
            }
        }
    }
}, { timestamps: true })

export default model("chats",chatSchema)