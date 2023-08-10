import { randomUUID } from "crypto"

type LogLevel = "debug" | "info" | "error"

type LoggerOptions = Partial<{
	doSaveToLogFile: boolean
	doConsoleLogs: boolean
	logFilePath: string
    logFields: Partial<{
        id: boolean
        time: boolean
        level: boolean
    }>
    includeLevels: LogLevel[]
}>

type LogMessage = {
	id: string
	timestamp: number
	msg: string
	logType: string
}

class MessageBuilder {
	logTypeMap: Map<LogLevel, string>
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

	build(type: LogLevel, msg: string): LogMessage {
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
	doConsoleLogs: boolean
    includeTime: boolean 
    includeId: boolean 
    includeLevel: boolean 
    levels: LogLevel[]
	messageBuilder: MessageBuilder
	constructor(name: string, options?: LoggerOptions) {
        this.name = name

		this.doConsoleLogs = options?.doConsoleLogs ?? true

        this.includeTime = options?.logFields?.time ?? true
        this.includeId = options?.logFields?.id ?? false
        this.includeLevel = options?.logFields?.level ?? true

        this.levels = options?.includeLevels ?? ["error", "info"]

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

        this.print(log)

        return
    }

	info(msg: string) {
        const log = this.messageBuilder.build("info", msg)

        this.print(log)

        return
    }

	debug(msg: string) {
        const log = this.messageBuilder.build("debug", msg)

        this.print(log)

        return
    }

    print(log: LogMessage) {
        if (this.doConsoleLogs) {
            console.log(this.getLogString(log))
        }
    }
}

export default Logger
