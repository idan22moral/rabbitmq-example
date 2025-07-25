const amqp = require('amqplib');

const RABBITMQ_URL = 'amqp://consumer:1234@localhost:5672';

async function receive() {
    const conn = await amqp.connect(RABBITMQ_URL);
    const channel = await conn.createChannel();
    const queue = 'tasks';

    await channel.assertQueue(queue, {
        durable: true,
        arguments: {
            "x-dead-letter-exchange": "",
            "x-dead-letter-routing-key": "tasks-dlq",
            "x-overflow": "reject-publish"
        }
    });

    console.log(" [*] Waiting for messages in '%s'. To exit press CTRL+C", queue);
    channel.consume(queue, msg => {
        if (msg !== null) {
            console.log(" [x] Received '%s'", msg.content.toString());
            channel.ack(msg);
        }
    });
}

receive().catch(console.error);
