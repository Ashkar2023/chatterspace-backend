// import cors from "cors";
import express from "express";
import axios from "axios";
import { Server } from "socket.io";
import { connect } from "mongoose";
import { createServer } from "node:http";

/* Local Modules */
import { Store } from "./socket.Store.js";
import SocketBroker from "./socket.Broker.js"

/* database Models */


/* implementations */
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const rabbitmq = new SocketBroker();

(async function () {
    const database = await connect("mongodb://mongo-db-service:27017/chatterspace");

    database && httpServer.listen(5555, () => {
        console.log("websocket server setup on 5555");
    });
})();

const store = new Store();

/* middlewares */
// app.use(cors({
//     origin:"http://localhost:8000/",
// }))



/* socket implementation */
io.on("connection", (socket) => {
    const credential = socket.handshake.query.email;
    store.addSocket({ socketId: socket.id, credential }); /** @argument {Object} */
    syncChats(credential, (error, msgList) => {
        if (error) {
            socket.emit("sync-chats", { message: "Error retrieving chats", error: error.message });
        } else {
            if (msgList.length > 1) {
                socket.emit("sync-chats", { message: "New chats found", msgList, count: msgList.length });
            } else {
                socket.emit("sync-chats", { message: "No new chats!", count: 0 });
            }
        }
    })

    console.log(store.showSocketStore());
    console.log(store.showCredentialStore());

    socket.on("sendPvtMsg", sendPvtMsg);

    socket.on('disconnect', (reason) => {
        store.removeSocket(socket.id);
        console.log(reason) // remove

        if (true) console.log("deleted", socket.id)
    })

})


/* socket events, functions & callbacks  */
const sendPvtMsg = async (data) => {
    data.sentAt = new Date(); // FOR NOW ONLY, coz postman dont have date.
    const credential = data.receiver;
    console.log(data)
    const recieverSocket = store.getSocket(credential);

    if (recieverSocket) {
        io.to(recieverSocket).emit("pvtMsg", data);
    } else {
        const stored = await rabbitmq.publishMessage("UND_MSG", "chat-message-queue", data); //eventType, routing-key, message
        console.log("published message :",stored);
    }
}


async function syncChats(credential, cb) {
    try {
        console.log(credential)
        const response = await axios.get(`http://message-service:5000/message/fetch/und/${credential}`);

        if (response.status === 200) {
            const { messageList } = response.data;
            cb(null, messageList);
            
        } else if (response.status === 204) {
            cb(null, []);
        
        }

    } catch (error) {
        cb(error, null);
    }
}


await rabbitmq.setup(()=>console.log("rabbitmq connected"));
