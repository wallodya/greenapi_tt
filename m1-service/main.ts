import express, { Request, Response } from "express"

import { channel, connect, connection } from "./mq-connect";
import Logger from "./logger";
import { EXPRESS_PORT, ADD_NUMBERS_QUEUE_NAME, SERVICE_NAME, ADD_NUMBERS_RESULT_QUEUE_NAME } from "./constants";


const app = express()

const logger = new Logger(SERVICE_NAME)

const validateQuery = (
	query: object
): { valid: false } | { valid: true; queryString: string } => {
	const hasRequiredFields = "a" in query && "b" in query

	if (!hasRequiredFields) {
		return { valid: false }
	}

	const numberA = Number(query.a)
	const numberB = Number(query.b)

	if (Number.isNaN(numberA) || Number.isNaN(numberB)) {
		return { valid: false }
	}

	return {
		valid: true,
		queryString: JSON.stringify(query),
	}
}

const getResultHandler = async (req: Request, res: Response) => {

    const queryParamsString = validateQuery(req.query)

    if (!queryParamsString.valid) {
        res.statusCode = 400
        res.json({
            message: "Invalid query params"
        })
        res.end()
        return
    }

    logger.debug(`GET '/' with params ${queryParamsString.queryString}`)

    channel.sendToQueue(ADD_NUMBERS_QUEUE_NAME, Buffer.from(queryParamsString.queryString))    

    const resultConsumerTag = "result-consumer"
    channel.consume(ADD_NUMBERS_RESULT_QUEUE_NAME, (msg) => {
        channel.cancel(resultConsumerTag)
        logger.info("Got result: " + msg?.content.toString())
        res.json(msg?.content.toString())
    }, {
        noAck: true,
        consumerTag: resultConsumerTag
    })

}

app.get('/', getResultHandler)
app.listen(EXPRESS_PORT, () => logger.info(`App listening on PORT ${EXPRESS_PORT}.`))

const main = async () => {
    await connect()
}

main()

process.on("beforeExit", async () => {
    await channel.close()
    logger.info("Closed channel")
    await connection.close()
})