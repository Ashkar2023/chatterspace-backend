import { Schema, Types, model } from 'mongoose';

const blockedUserSchema = new Schema({
    email: {
        type: String,
        required: [true, "Email is required to Block user"]
    },
    userId: {
        type: Types.ObjectId,
        required: [true, "User-Id is required to Block user"]
    }
})


const userSchema = new Schema({
    username: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: [true, "Email must be unique"],
        trim: true
    },
    password: {
        type: String,
        required: [true, "Provide password"],
        select: false //use +password in query with select('-password') stage
    },
    profilePicture: {
        type: String,
        trim: true
    },
    lastSeen: {
        type: Date,
        default: Date.now
    },
    refreshToken: {
        type: String
    },
    blocked: [
        blockedUserSchema
    ]
});


export default model('users', userSchema);