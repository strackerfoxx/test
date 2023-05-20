import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

export const create = async (req, res) => {
    const post = await Post.findById(req.query._id)
    const {description} = req.body
    try {
        post.description = description 
        post.save()
        return res.status(200).json({msg: "Post Publicado"})
    } catch (error) {
        return res.status(401).json({msg: error.message})
    }
}

export const update = async (req, res) => {
    const post = await Post.findById(req.query.id)
    if(!post || post.author._id.valueOf() !== req.user._id.valueOf() && req.user._id.valueOf() !== process.env.MASTER_KEY) return res.status(401).json({msg: "Not valid Operation"})
    try {
        post.description = req.body.description
        post.save()
        return res.status(200).json({msg: "Post actualizado"})
    } catch (error) {
        return res.status(401).json({msg: error.message})
    }
}

export const deletePost = async (req, res, next) => {
    const post = await Post.findById(req.query.id)
    req.archivo = post.image.split("=")[1]
    if(post.author._id.valueOf() !== req.user._id.valueOf() && req.user._id.valueOf() !== process.env.MASTER_KEY) return res.status(401).json({msg: "Not valid Operation"})
    try {
        post.comments.map(async comment => {
            await Comment.findByIdAndDelete(comment.valueOf())
        })
        await Post.findByIdAndDelete(req.query.id)
        next()
    } catch (error) {
        return res.status(401).json({msg: error.message})
    }
}

export const listarPosts = async (req, res) => {
    const posts = await Post.find()
    res.send(posts)
}
export const image = async (req, res) => {
    res.download(`./uploads/${req.query.img}`)
}

export const addComment = async (req, res) => {
    const post = await Post.findById(req.query.id)
    const {likes, _id, author, content} = req.comment
    if(!post) return res.status(404).json({msg: "Post not found"})
    try {
        post.comments = [...post.comments, {likes, _id, author, content}]
        post.save()
        return res.status(200).json({msg: "Comentario publicado"})
    } catch (error) {
        return res.status(404).json({msg: error.message})
    }
}
