import mongoose from "mongoose";
import bcrypt from "bcrypt";

const postSchema = mongoose.Schema({
    image: {
        type: String,
        trim: true,
        required: true
    },
    author: {
        
    },
    description: {
        type: String,
        trim: true,
    },
    likeAuthor: [
        {
            
        }
    ],
    likes: {
        type: Number,
        default: 0
    },
    comments: [
        {
        }
    ],
}, {
    timestamps: true,
})

const Post = mongoose.model("Post", postSchema)
export default Post