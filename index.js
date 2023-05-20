import express from "express"
import connectDB from "./config/db.js"
import dotenv from "dotenv"
import routerUser from "./routes/userRoutes.js"
import routerPost from "./routes/postRoutes.js"
import routerLike from "./routes/likeRoutes.js"
import routerComment from "./routes/commentRoutes.js"
import routerLikeComment from "./routes/likeCommentController.js"
import cors from "cors"

connectDB()
dotenv.config()
const app = express();

// Esta ruta se escapa de la politica del cors y permite acceder sin necesidad del cors (antes usaba la ruta de image de post)

app.get('/api/image', (req, res) => {
    res.download(`./uploads/${req.query.img}`)
});
app.use(express.static("uploads"))

app.get('/', (req, res) => {
    res.send("Im working")
});

// // *******************Configurar CORS   Comentar esta zona para usar postman*******************

const whitelist = [process.env.FRONTEND_URL]
const corsOptions = {
    origin: function(origin, callback){
        if(whitelist.includes(origin)){
            // Puede consultar la API
            callback(null, true) 
        }
    }
}
app.use(cors(corsOptions))

// // *******************Comentar esta zona para usar postman*******************


app.use(express.json())
app.use("/api/users", routerUser)
app.use("/api/posts", routerPost)
app.use("/api/likes", routerLike)
app.use("/api/comment", routerComment)
app.use("/api/comment/like", routerLikeComment)

const PORT = process.env.PORT || 4000;
app.listen(PORT)