import amqplib from "amqplib";
import messageModel from "./models/message.Model.js";

const uri = "amqp://rabbitmq-service:5672";
const queueName = "chat-message-queue";
const exchange = "chat-exchange";

class MessageBroker {
    connection;
    consumerChannel;
    queue = queueName;
    exchange = exchange;

    constructor() {
        this.queue = queueName;
    }

    async setup(cb) {
        if (this.connection) return;

        this.connection = await amqplib.connect(uri);
        this.consumerChannel = await this.connection.createChannel();

        await this.consumerChannel.assertQueue(this.queue);
        await this.consumerChannel.assertExchange(this.exchange);
        await this.consumerChannel.bindQueue(this.queue, this.exchange, "chat-message-queue")

        cb();
    }

    async consumeMessage(){
        if (!this.connection) await this.setup();

        await this.consumerChannel.consume(this.queue, async (data) => {
            try {
                const message = JSON.parse(data.content.toString());
                const eventType = message.eventType;

                switch (eventType) {
                    case "UND_MSG":
                        await storeMessageToDb(message.message);
                        break;
                    default:
                        console.log("default case fired", eventType);
                        break;
                }

                this.consumerChannel.ack(data);
            } catch (error) {
                console.error(error.message);
                this.consumerChannel.nack(data);
                throw error; // Rethrow to handle further up the call stack
            }
        }, { noAck: false });
    }
}

// Assuming messageModel is imported or defined elsewhere
const storeMessageToDb = async (data) => {
    try {
        const newMsg = new messageModel({
            receiver: data.receiver,
            sender: data.sender,
            type: data.type,
            content: data.content,
            sentAt:data.sentAt,
            metadata: data.metadata ?? null
        });

        const saved = await newMsg.save();
        return saved;
    } catch (error) {
        console.error(error.message);
        throw error; // Rethrow to handle further up the call stack
    }
};

export default MessageBroker;
