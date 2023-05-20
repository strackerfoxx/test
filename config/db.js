import mongoose from "mongoose"
export default async function connectDB() {
    try {
        const connection = await mongoose.connect("mongodb+srv://root:vegetta777@cluster0.h5hj0hj.mongodb.net/socialnetwork", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}