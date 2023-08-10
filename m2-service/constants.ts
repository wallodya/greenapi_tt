export const SERVICE_NAME = "M2"

const MQ_URL_LOCAL = "amqp://localhost:5672"
const MQ_URL_DOCKER = "amqp://gapi_user:gapi_password@greenapimq:5672"
export const MQ_URL = MQ_URL_DOCKER
export const ADD_NUMBERS_QUEUE_NAME = "add-numbers"
export const ADD_NUMBERS_RESULT_QUEUE_NAME = "add-numbers-result"
