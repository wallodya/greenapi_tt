import amqplib, { Channel, Connection } from 'amqplib'
import Logger from "./logger";

const MQ_URL = "amqp://gapi_user:gapi_password@greenapimq:5672"
const queueName = "gapiQueue"

const logger = new Logger("M2")

let connection: Connection, channel: Channel

const connect = async () => {
    logger.info("Connecting to MQ...")
    try {
        connection = await amqplib.connect(MQ_URL)
        channel = await connection.createChannel()
        await channel.assertQueue(queueName)
        logger.info("Connected!")
    } catch (error) {
        logger.error(String(error))
    }
}

connect()
