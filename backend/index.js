import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import jwt from "jsonwebtoken";
import userRouter from './routes/userRoutes.js'
dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use(
    (req,res,next)=>{
        const value = req.header("Authorization");
        if(value != undefined){
            const token = value.replace("Bearer ","");
            jwt.verify(token, process.env.JWT_SECRET,
                (err, decoded)=>{
                    if(decoded == null){
                        res.status(401).json({message: "Unauthorized"});
                    }else{
                        req.user = decoded;
                        next();
                    }
                }
            )
        }else{
            next();
        }
        
    }
)

// connect mongodb database
const MONGODB_URL = process.env.MONGODB_URL;
mongoose.connect(MONGODB_URL).then(()=>{
    console.log("Connected to MongoDB");
}).catch((e)=>{
    console.log(e);
})

app.use("/users", userRouter);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

