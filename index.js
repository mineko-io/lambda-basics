const AWS = require('aws-sdk')
const ssm = new AWS.SSM()

const Sentry = require('@sentry/node')
Sentry.init({ dsn: process.env.SENTRY_DSN, environment: process.env.SENTRY_ENV })

const getParameterValue = parameterResponse => parameterResponse.Parameter.Value
const getSSMParameterValue = Name => new Promise((resolve, reject) => {
    ssm.getParameter({
        Name,
        WithDecryption: true
    }, (err, data) => err ? reject(err) : resolve(getParameterValue(data)))
})

const getResponseObject = (statusCode, headers, body) => ({
    statusCode,
    headers,
    body: JSON.stringify(body)
})

const getErrorResponseBody = (message, type) => log(`Error response of type "${type}" with message: "${message}"`) || ({
    error: {
        message,
        type
    }
})

const log = message => {
    console.log(message)
    Sentry.captureMessage(message)
}

const logException = exception => {
    console.log(exception)
    Sentry.captureException(exception)
}

const validateRequestParams = requiredParams = params => {
    const paramsKeys = Object.keys(params)
    return requiredParams.filter(key => !paramsKeys.includes(key))
}

module.exports = ({
    getSSMParameterValue,
    getResponseObject,
    getErrorResponseBody,
    log,
    logException,
    validateRequestParams
})