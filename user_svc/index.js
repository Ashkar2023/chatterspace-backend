// import cors from "cors";
import express from "express";
import { connect } from "mongoose";
import session from "express-session";
import axios from "axios";
import request from "supertest";


/* local modules */
import userModel from "./models/user.Model.js";


/* implementations */
const app = express();

; (async function () {
    const database = await connect("mongodb://mongo-db-service:27017/chatterspace");
    if (database) {
        console.log("database connected");
        app.listen(3000, () => {
            console.log("server started at 3000");
        });
    }
})();

app.use(
    session({
        secret: "sjnauadnvkndfasdf",
        resave: true,
        saveUninitialized: false,
        cookie: {
            maxAge: 600000,
            expires: false,
            rolling: true
        }
    }
    ))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const user_router = express.Router();
app.use("/user", user_router);


/* ROUTES */

user_router.post("/signup", async (req, res, next) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });
        console.log(user)
        if (!user) {
            const user = new userModel({
                username: req.body.name,
                email: req.body.email,
                password: req.body.password
            });
            await user.save();
            res.status(200).json({ message: 'User registered successfully', success: true });
        } else {
            res.status(200).json({ message: 'email already registered!', success: false });
        }
    } catch (error) {
        next(error)
    }
});


user_router.post('/login', async (req, res, next) => {
    try {
        const user = await userModel.findOne({ email: req.body.email }).select("+password");
        console.log(req.body,"\n",user);
        if (!user) {
            return res.status(404).send('No user found');
        }
        const isValidPassword = req.body.password === user.password;
        if (!isValidPassword) {
            return res.status(401).send('Invalid password');
        }
        req.session.user = user.email;
        req.session.userId = user._id;

        res.status(200).json({ message: 'Login successful', success: true });
    } catch (error) {
        next(error);
    }
});


user_router.post('/search', async (req, res, next) => {
    try {
        const { searchValue } = req.body;

        const users = await userModel.find({ username: searchValue }).select("username profilePicture");

        if (users.length !== 0) {
            res.status(200).json({ success: true, usersList: users, message: "userList fetch success" });
        } else {
            res.status(204).json({ message: "userList fetch success", success: true });
        }
    } catch (error) {
        next(error);
    }
});

user_router.post('/newchat', async (req, res, next) => {
    try {
        const { creator, target } = req.body;
        const users = await userModel.find({ username: 
            { $in: 
                [creator, target]
            } 
        });

        const response = await axios.post(`http://chat-service:7000/chat/addchat`, {
            users: users
        });

        if (response.status === 201) {
            res.status(201).json(response.data)
        } else if(response.status === 500) {
            res.status(500).json({message:response.data+" in chat server", success: false});
        }else{
            res.status(400).json(response.data);
        }
    } catch (error) {
        next(error)
    }
});

/* GLobal Error handling */
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

