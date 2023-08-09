import {randomUUID} from "crypto"

type LogType = "debug" | "info" | "error"

type LoggerOptions = Partial<{
	doSaveToLogFile: boolean
	doConsoleLogs: boolean
	logFilePath: string
}>

type LogMessage = {
	id: string
	timestamp: number
	msg: string
	logType: string
}

class MessageBuilder {
	logTypeMap: Map<LogType, string>
	constructor() {
		this.logTypeMap = new Map([
			["debug", "DUBUG"],
			["info", "INFO"],
			["error", "ERROR"],
		])
	}
	getLogTime() {
		return Date.now()
	}

	createLogId() {
		return randomUUID()
	}

	build(type: LogType, msg: string): LogMessage {
		const logType = this.logTypeMap.get(type)

		if (!logType) {
			throw new Error("Log type is not included in name map")
		}

		const id = this.createLogId()
		const timestamp = this.getLogTime()

		return {
			msg,
			logType,
			id,
			timestamp,
		}
	}
}

class Logger {
    name: string
	logFilePath: string
	doSaveToLogFile: boolean
	doConsoleLogs: boolean
	messageBuilder: MessageBuilder
	constructor(name: string, options?: LoggerOptions) {
        this.name = name
		this.doSaveToLogFile = options?.doSaveToLogFile ?? true
		this.logFilePath = options?.logFilePath ?? "./logs.csv"
		this.doConsoleLogs = options?.doConsoleLogs ?? true
		this.messageBuilder = new MessageBuilder()
	}

    getLogString({timestamp, logType, msg, id}: LogMessage) {
        const time = new Date(timestamp).toLocaleString()
        return `${this.name} [${logType}] ${time} || ${msg} (${id})`
    }

    getCSVString({timestamp, logType, msg, id}: LogMessage) {
        return `${id},${this.name},${logType},${timestamp},${msg}`
    }

	error(msg: string) {
        const log = this.messageBuilder.build("error", msg)

        if (this.doConsoleLogs) {
            console.log(this.getLogString(log))
        }

        if (this.doSaveToLogFile) {

        }

        return
    }

	info(msg: string) {
        const log = this.messageBuilder.build("info", msg)

        if (this.doConsoleLogs) {
            console.log(this.getLogString(log))
        }

        if (this.doSaveToLogFile) {

        }

        return
    }

	debug(msg: string) {
        const log = this.messageBuilder.build("debug", msg)

        if (this.doConsoleLogs) {
            console.log(this.getLogString(log))
        }

        if (this.doSaveToLogFile) {

        }

        return
    }
}

export default Logger
