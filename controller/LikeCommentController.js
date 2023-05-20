import Comment from "../models/Comment.js"
import User from "../models/Usuarios.js"

export const like = async (req, res) => {
    const comment = await Comment.findById(req.query.id)
    if(!comment) return res.status(404).json({msg: "Comment Not Found"})
    if(!req.user) return res.status(404).json({msg: "User Not Found"})
    var existe = false;
    comment.likeAuthor.map(like => {
        if(like.valueOf() !== req.user._id.valueOf()) return
        existe = true;
    })
    if(existe){ 
        try {
            comment.likes -= 1
            comment.likeAuthor = comment.likeAuthor.filter((value) => value.valueOf() !== req.user._id.valueOf())
            comment.save()
            return res.status(200).json({msg: "Like deleted successfully"})
        } catch (error) {
            return res.status(404).json({msg: error.message})
        }
    }else{
        try {
            comment.likes += 1
            comment.likeAuthor = [...comment.likeAuthor, req.user]
            comment.save()
            return res.status(200).json({msg: "Like added successfully"})
        } catch (error) {
            return res.status(404).json({msg: error.message})
        }
    }
}