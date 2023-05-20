import mongoose from "mongoose";
import bcrypt from "bcrypt";

const usuarioSchema = mongoose.Schema({
    profile: {
        type: String,
        trim: true,
        default: `http://localhost:4000/api/image?img=profile.jpg`
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    token: {
        type: String,
    },
    private: {
        type: Boolean,
        default: false
    },
    confirmed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
})

usuarioSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next()
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model("Usuario", usuarioSchema)
export default User