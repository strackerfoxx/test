import express from "express"
const router = express.Router()
import { auth } from "../middleware/auth.js"
import { comment, deleteComment, updateComment } from "../controller/CommentController.js"

router.post("/", auth, comment )
router.patch("/", auth, updateComment )
router.delete("/", auth, deleteComment )

export default router