import express from "express"
const router = express.Router()
import { auth } from "../middleware/auth.js"
import { like } from "../controller/LikeController.js"

router.get("/", auth, like )

export default router 