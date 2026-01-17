import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        userId:{
            type: String,
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: Number,
            required: true
        },
        address:{
            type: String,
            required: true
        },
        isBlocked:{
            type: Boolean,
            default: false
        },
        role:{
            type: String,
            enum:["user", "admin"],
            default: "user"
        },
        date:{
            type: Date,
            default: Date.now
        }
    }
)

const User = mongoose.model("User", userSchema);

export default User;