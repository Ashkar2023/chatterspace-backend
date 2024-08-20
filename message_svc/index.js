import express, { Router } from "express";
import { connect } from "mongoose";

/* Local Modules */
import MessageBroker from "./msg-svc.Broker.js";

/* database Models */
import messageModel from "./models/message.Model.js";

const app = express();
const rabbitmq = new MessageBroker();

(async function () {
    const database = await connect("mongodb://mongo-db-service:27017/chatterspace");

    database && app.listen(5000, () => {
        console.log("database connected")
        console.log("server started at 5000");
        startBroker();
    });

})();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const message_router = Router();
app.use("/message", message_router);


/* Routes */
message_router.get("/", (req, res, next) => {
    res.send("message service online")
})

message_router.get('/fetch/und/:receiver', async (req, res, next) => {
    try {
        const { receiver } = req.query;
        const messageList = await messageModel.find(receiver).sort({ sentAt: -1 });
        console.log(messageList);

        if (messageList.length > 0) {
            res.status(200).json({ message: "undelivered chats found!", success: true, messageList })
        } else {
            res.status(204).send()
        }
    } catch (error) {
        next(error)
    }
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

async function startBroker() {
    await rabbitmq.setup(() => {
        console.log("rabbitmq connected");
    });
    await rabbitmq.consumeMessage();
}
