import Post from "../models/Post.js"
import User from "../models/Usuarios.js"

export const like = async (req, res) => {
    const post = await Post.findById(req.query.id)
    const user = await User.findById(req.user._id)
    const {_id, username} = user
    if(!post) return res.status(404).json({msg: "Post Not Found"})
    if(!user) return res.status(404).json({msg: "User Not Found"})
    var existe = false;
    post.likeAuthor.map(like => {
        if(like._id.valueOf() !== user._id.valueOf()) return
        existe = true;
    })
    if(existe){
        try {
            post.likes -= 1
            post.likeAuthor = post.likeAuthor.filter((value) => value._id.valueOf() !== user._id.valueOf())
            post.save()
            return res.status(200).json({msg: "Like deleted successfully"})
        } catch (error) {
            return res.status(404).json({msg: error.message})
        }
    }else{
        try {
            post.likes += 1
            post.likeAuthor = [...post.likeAuthor, {_id, username}]
            post.save()
            return res.status(200).json({msg: "Like added successfully"})
        } catch (error) {
            return res.status(404).json({msg: error.message})
        }
    }
}