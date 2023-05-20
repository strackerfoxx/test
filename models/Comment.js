import mongoose from "mongoose";
import bcrypt from "bcrypt";

const commentSchema = mongoose.Schema({
    author:{
    },
    content: {
        type: String,
        trim: true,
        required: true
    },
    likeAuthor: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario"
        }
    ],
    likes: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
})

const Comment = mongoose.model("Comment", commentSchema)
export default Comment