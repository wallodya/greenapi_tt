import { ConsumeMessage } from "amqplib";
import { ADD_NUMBERS_QUEUE_NAME, ADD_NUMBERS_RESULT_QUEUE_NAME } from "./constants";
import Logger from "./logger";
import { channel, connect, connection } from "./mq-connect";

const logger = new Logger("M2")

const messageHandler = (msg: ConsumeMessage | null) => {
    if (!msg) {
        logger.error("Recieved empty message")
        return
    }

    const content = JSON.parse((msg.content.toString()))

    logger.debug(`Recieved message: ${content}`)

    if (!("a" in content) || !("b" in content)) {
        logger.error("Message is invalid")
        return
    }


    const a = Number(content.a)
    const b = Number(content.b)

    if (Number.isNaN(a) || Number.isNaN(b)) {
        logger.error(`Field values are invalid`)
    }

    const result = a + b

    channel.sendToQueue(ADD_NUMBERS_RESULT_QUEUE_NAME, Buffer.from(String(result)))
    
    logger.debug(`Result: ${result}`)
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
