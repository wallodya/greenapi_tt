import { ConsumeMessage } from "amqplib";
import { ADD_NUMBERS_QUEUE_NAME, ADD_NUMBERS_RESULT_QUEUE_NAME } from "./constants";
import Logger from "./utils/logger";
import { channel, connect, connection } from "./mq-connect";
import { getMessageContent, validateMessageContent } from "./utils/validation";

const logger = new Logger("M2", { includeLevels: ["debug", "error", "info"]})

const messageHandler = (msg: ConsumeMessage | null) => {
    if (!msg) {
        logger.error("Received empty message")
        return
    }

    logger.debug(`Headers: ${JSON.stringify(msg.properties)}`)

    const content = getMessageContent(msg)

    logger.debug(`Received message: ${JSON.stringify(content)}`)

    if (!validateMessageContent(content)) {
        logger.error("Message is invalid")
        return
    }

    const a = Number(content.a)
    const b = Number(content.b)

    if (Number.isNaN(a) || Number.isNaN(b)) {
        logger.error(`Field values are invalid`)
    }

    const result = a + b

    channel.sendToQueue(
		msg.properties.replyTo,
		Buffer.from(String(result)),
		{
			correlationId: msg.properties.correlationId ,
		}
	)
    
    logger.debug(`Calculated result: ${result}`)
}

const main = async () => {
    await connect()

    channel.consume(ADD_NUMBERS_QUEUE_NAME, messageHandler, {
        noAck: true
    })
}

main()

process.on("beforeExit", async () => {
    await channel.close()
    await connection.close()
    logger.info("Closed connection to broker")
})
