import express from "express"
const router = express.Router()
import { auth } from "../middleware/auth.js"
import { crearArchivo, deleteArchivo } from "../controller/FileController.js"
import { create, deletePost, update, listarPosts, addComment, image } from "../controller/PostController.js"
import { comment } from "../controller/CommentController.js"

router.get("/", listarPosts )
router.get("/image", image )
router.post("/", auth, crearArchivo)
router.post("/description", auth, create)
router.post("/comment", auth, comment, addComment )
router.delete("/", auth, deletePost, deleteArchivo ) 
router.patch("/", auth, update )

export default router 