const amqp = require('amqplib');

const RABBITMQ_URL = 'amqp://producedr:5678@localhost:5672';

async function send(msg) {
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

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)), { persistent: true });
    console.log(" [x] Sent '%s'", msg);

    setTimeout(() => {
        conn.close();
        process.exit(0);
    }, 500);
}

const msg = 'Do something important!';


send(msg).catch(console.error);
