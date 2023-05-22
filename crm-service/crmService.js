const kafka = require('kafkajs').Kafka;
const { sendEmail } = require('./emailer');

const kafkaBrokers = ['44.214.218.139:9092', '44.214.213.141:9092'];
const kafkaClientId = 'crm-service';
const kafkaTopic = 'haoxuanm.customer.evt';


const kafkaClient = new kafka({ clientId: kafkaClientId, brokers: kafkaBrokers });

const main = async () => {
    const consumer = kafkaClient.consumer({ groupId: 'crm-group-new' });

    await consumer.connect();
    await consumer.subscribe({ topic: kafkaTopic });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const customer = JSON.parse(message.value.toString());
            await sendEmail(customer);
        }
    });
};

main().catch(console.error);
