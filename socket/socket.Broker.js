import amqplib from "amqplib"

const uri = "amqp://rabbitmq-service:5672";
const exchangeName = "chat-exchange";
const queueName = "chat-message-queue";

class SocketBroker {
    queue;
    exchange;
    connection;
    publisherChannel;
    // consumerChannel;

    async setup(cb) {
        if (this.connection) return this.connection;

        this.connection = await amqplib.connect(uri);
        this.publisherChannel = await this.connection.createChannel();
        this.exchange = exchangeName;
        this.queue = queueName;

        await this.publisherChannel.assertExchange(this.exchange, "direct")

        return cb();
    }

    async publishMessage(eventType, routingKey, message) {
        if (!this.connection) await this.setup();

        const bufferedMessage = Buffer.from(JSON.stringify({
            eventType,
            message,
            timeStamp: new Date()
        }))
        
        return await this.publisherChannel.publish(this.exchange, routingKey, bufferedMessage);
    };
}

export default SocketBroker;