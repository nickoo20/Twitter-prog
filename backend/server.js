import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import connectMongodb from "./db/connectMongodb.js";
import cookieParser from "cookie-parser";

dotenv.config();

// mongoose.connect(process.env.MONGO_URI)
// .then(() => {
//         console.log('Mongoose Connected ! ')
//     })
//     .catch((err) => {
//             console.log(err) ;
//         });

const app = express();
const PORT = process.env.PORT || 5001;

// console.log(process.env.MONGO_URI) ;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);

// app.get('/', (req, res)=>{
//     res.send("Server is ready!") ;
// })

app.listen(PORT, () => {
  console.log(`Server is Running on localhost: ${PORT}`);
  connectMongodb();
});
