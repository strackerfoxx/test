import Comment from "../models/Comment.js"
import User from "../models/Usuarios.js"
import Post from "../models/Post.js"

export const comment = async (req, res, next)  => {
    const comment = await new Comment()
    const user = await User.findById(req.user._id)
    const {_id, username, profile} = user
    if(!req.user) return res.status(404).json({msg: "User Not Found"})
    if(!req.body.content) return res.status(404).json({msg: "Contenido Obligatorio"})

    try {
        comment.author = {_id, username, profile}
        comment.content = req.body.content
        comment.save()
        req.comment = comment
        next()
    } catch (error) {
        return res.status(400).json({msg: error.message})
    }
}

export const updateComment = async (req, res) => {
    const comment = await Comment.findById(req.query.id)
    const posts = await Post.find()
    if(!comment) return res.status(404).json({msg: "Comment not found"})
    if(comment.author._id.valueOf() !== req.user._id.valueOf() && req.user._id.valueOf() !== process.env.MASTER_KEY) return res.status(400).json({msg: "Not valid Operation"})
    try {
        posts.map(post => {
            post.comments.map(comment => {
                if(comment._id.valueOf() !== req.query.id.valueOf()) return
                const {likes, _id, author} = comment
                const {content} = req.body
                try {
                    
                    post.comments = [...post.comments.filter(comentario => comentario._id.valueOf() !== comment._id.valueOf()), { likes, _id, author, content }]
                    post.save()
                } catch (error) {
                    return res.status(400).json({msg: error.message})
                }
            })
        })
        comment.content = req.body.content
        comment.save()
        return res.status(200).json({msg: "Comentario Modificado con exito"})
    } catch (error) {
        return res.status(400).json({msg: error.message})
    }
}

export const deleteComment = async (req, res)  => {
    const comment = await Comment.findById(req.query.id)
    const posts = await Post.find()
    if(!comment) return res.status(404).json({msg: "Comment Not Found"})
    if(comment.author._id.valueOf() !== req.user._id.valueOf() && req.user._id.valueOf() !== process.env.MASTER_KEY) return res.status(401).json({msg: "Not valid Operation"})
    try {
        posts.map(post => {
            try {
                post.comments = post.comments.filter(comentario => comentario._id.valueOf() !== comment._id.valueOf())
                post.save()
            } catch (error) {
                return res.status(400).json({msg: error.message})
            }
        })
        await Comment.findByIdAndDelete(req.query.id)
        return res.status(200).json({msg: "Comentario Borrado con exito"})
    } catch (error) {
        return res.status(400).json({msg: error.message})
    }

}