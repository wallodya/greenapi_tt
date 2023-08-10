import amqplib, { Channel, Connection } from 'amqplib'
import Logger from "./utils/logger";
import { ADD_NUMBERS_QUEUE_NAME, ADD_NUMBERS_RESULT_QUEUE_NAME, MQ_URL, SERVICE_NAME } from './constants';

const logger = new Logger(`${SERVICE_NAME}.connector`)

export let connection: Connection, channel: Channel

export const connect = async () => {
    logger.info("Connecting to MQ...")
    try {
        connection = await amqplib.connect(MQ_URL)
        logger.info("Connected to broker")

        channel = await connection.createChannel()
        await channel.assertQueue(ADD_NUMBERS_QUEUE_NAME, {
            durable: false
        })

        await channel.assertQueue(ADD_NUMBERS_RESULT_QUEUE_NAME, {
            durable: false
        })

        logger.info("Asserted queue")
    } catch (error) {
        logger.error(String(error))
    }
}
