import express, { Router } from "express";
import  { connect } from "mongoose";
import chatModel from "./models/chat.Model.js"

const app = express();

;(async function (){
    const database = await connect("mongodb://mongo-db-service:27017/chatterspace");
    if(database){
        console.log("database connected");
    }
})();
app.listen(7000,()=>{
    console.log("server started at 7000");
});

app.get("/chat",(req,res)=>{
    res.send("chat service online")
})

const chat_router = Router();
app.use("/chat",chat_router)

chat_router.post('/addchat', async (req, res, next) => {
    try {
        const { users } = req.body;

        if (!Array.isArray(users) || users.length !== 2) {
            return res.status(400).json({ 
                message: "You must provide exactly two user IDs.",
                success:false 
            });
        }

        const newChat = new Chat({ users });
        await newChat.save();

        res.status(201).json(newChat);
    } catch (error) {
        next(error);
    }
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
