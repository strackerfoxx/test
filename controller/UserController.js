import User from "../models/Usuarios.js"
import Post from "../models/Post.js"
import bcrypt from "bcrypt"
import {string} from "../helpers/index.js"
import { genJWT } from "../helpers/index.js"

export const create = async (req, res)  => {
    const {username, email} = req.body
    if(await User.findOne({username})) return res.status(401).json({msg: "Este Nombre de Usuario ya existe"})
    if(await User.findOne({email})) return res.status(401).json({msg: "Este Email ya fue registrado"})
    try {
        await User.create(req.body)
        res.status(200).json({msg: "Usuario creado con exito"})
    } catch (error) {
        res.status(404).json({msg: error.message})
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body
    const user = await User.findOne({email})
    if(!bcrypt.compareSync(password, user.password)) return res.status(401).json({msg: "El Email o la Contraseña NO son correctos"})
    if(!user.confirmed){
        try {
            user.token = string(40)
            user.save()
            return res.status(200).json({msg: "Se le envió un correo de verificacion a su email"})
        } catch (error) {
            return res.status(400).json({msg: error.message})
        }
    }
    const {username} = user
    try {
        user.token = ""
        user.save()
        return res.status(200).json({"user": {
            token: genJWT(user._id),
            username
        }})
    } catch (error) {
        return res.status(400).json({msg: error.message})
    }
}

export const verify = async (req, res) => {
    const {token} = req.query
    const user = await User.findOne({token})
    if(!user || !token)return res.status(401).json({msg: "Token no valido"})
    try {
        user.confirmed = true
        user.token = ""
        user.save()
        return res.status(200).json({msg: "Usuario Verificado"})
    } catch (error) {
        return res.status(400).json({msg: error.message})
    }
}

export const forget = async (req, res) => {
    const {email} = req.body
    const user = await User.findOne({email})
    if(!user || !email)return res.status(401).json({msg: "Usuario no encontrado"})
    try {
        user.token = string(40)
        user.save()
        return res.status(200).json({msg: "Correo de recuperacion enviado"})
    } catch (error) {
        return res.status(400).json({msg: error.message})
    }
}
export const newPass = async (req, res) => {
    const {token} = req.query
    const user = await User.findOne({token})
    if(!user || !token)return res.status(401).json({msg: "Token no valido"})
    try {
        user.token = ""
        user.password = req.body.password
        user.save()
        return res.status(200).json({msg: "Contraseña modificada"})
    } catch (error) {
        return res.status(400).json({msg: error.message})
    }
}

export const profileImage = async (req, res, next) => {
    const user = await User.findById(req.user._id)
    const posts = await Post.find({"author.username": user.username})

    if(!user) return res.status(404).json({msg: "usuario no encontrado"})
    try {
        posts.map(async post => {
            try {
                post.author = {"_id": post.author._id, "username": post.author.username, "profile": `${process.env.BACKEND_URL}/api/image?img=${req.image}`}
                post.save()
            } catch (error) {
                console.log(error)
            }
        })
        user.profile = `${process.env.BACKEND_URL}/api/image?img=${req.image}`
        user.save()
        return res.status(200).json({msg: "Foto Actualizada"})
    } catch (error) {
        return res.status(400).json({msg: error.message})
    }
}

export const getUser = async (req, res, next) => {
    const respuesta = await User.find({username: req.query.username})
    if(!respuesta) return res.status(404).json({msg: "usuario no encontrado"})
    const user = respuesta[0]
    const {username, createdAt, name, profile} = user
    const posts = await Post.find({"author.username": user.username})
    return res.status(404).json({user: {username, createdAt, name, profile}, posts})
}