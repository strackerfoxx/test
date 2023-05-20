import express from "express"
const router = express.Router()
import { create, login, verify, forget, newPass, profileImage, getUser} from "../controller/UserController.js"
import { auth } from "../middleware/auth.js"
import { newProfileImage } from "../controller/FileController.js"

router.post("/", create)
router.post("/login", login)
router.get("/verify", verify)
router.post("/forget", forget)
router.post("/newpassword", newPass)
router.post("/image", auth, newProfileImage, profileImage)
router.get("/posts", getUser)

export default router 