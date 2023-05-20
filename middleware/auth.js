import jwt from "jsonwebtoken"
import User from "../models/Usuarios.js"

export const auth = async (req, res, next) => {
    const token = req.headers?.authorization?.split(" ")[1]
    if(token){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await User.findById(decoded.id).select("-password -confirmed -token -createdAt -updatedAt -private -__v -email -name")
            next()
        } catch (error) {
            return res.status(404).json({msg: error.message})
        }
    }else{
        res.status(404).json({msg: "Token not valid"})
        next()
    }
}