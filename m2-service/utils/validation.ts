import { ConsumeMessage } from "amqplib"

export const getMessageContent = (msg: ConsumeMessage) => {
    return JSON.parse((msg.content.toString()))
}

export const validateMessageContent = (content: object) => {
    return "a" in content && "b" in content
}
