import express from "express"
const router = express.Router()
import { auth } from "../middleware/auth.js"
import { like } from "../controller/LikeCommentController.js"

router.get("/", auth, like )

export default router 