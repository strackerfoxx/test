import multer from "multer"
import {string} from "../helpers/index.js"
import fs from "fs"
import Post from "../models/Post.js"
import User from "../models/Usuarios.js"

export const crearArchivo = async (req, res) => {
    const random = string(20) + ".jpeg"
    const configuracionMulter = {
        limits : { fileSize : 5000000 },
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, './uploads')
            },
            filename: (req, file, cb) => {
                cb(null, random );
            }
        })
    }
    const upload = multer(configuracionMulter).single('image');

    upload(req, res, async (err) => {
        if(err){
            return res.json({msg: err.message})
        }
    })
    const post = new Post()
    req.post = post._id

    const user = await User.findById(req.user._id)
    const {_id, username, profile} = user
 
    try {
        post.image = `${process.env.BACKEND_URL}/api/image?img=${random}`
        post.author = {_id, username, profile}
        post.save()
        return res.status(200).json({img : post.image, _id: post._id, msg: "Post Realizado correctamente"})
    } catch (error) {
        return res.status(400).json({msg: error.message})
    }
}

export const newProfileImage = async (req, res, next) => {
    req.image = string(20) + ".jpeg"
    const configuracionMulter = {
        limits : { fileSize : 5000000 },
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, './uploads')
            },
            filename: (req, file, cb) => {
                cb(null, req.image );
            }
        })
    }
    const upload = multer(configuracionMulter).single('image');

    upload(req, res, async (err) => {
        if(err){
            res.json({msg: err.message})
        }
    })
    next()
}

export const deleteArchivo = (req, res) => {
    try {
        fs.unlinkSync(`./uploads/${req.archivo}`);
        return res.status(200).json({msg: "Post eliminado"})
    } catch (error) {
        console.log(error)
    }
}