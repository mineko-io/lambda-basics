const axios = require('axios')
const qs = require('qs')
const AWS = require('aws-sdk')
const ssm = new AWS.SSM()

const Sentry = require('@sentry/node')
Sentry.init({ dsn: process.env.SENTRY_DSN, environment: process.env.SENTRY_ENV || process.env.APP_ENVIRONMENT })

const getParameterValue = parameterResponse => parameterResponse.Parameter.Value
const getSSMParameterValue = Name => new Promise((resolve, reject) => {
    ssm.getParameter({
        Name,
        WithDecryption: true
    }, (err, data) => err ? reject(err) : resolve(getParameterValue(data)))
})

const prepareHeaders = (headers, cors) => cors ? ({ ...headers, 'Access-Control-Allow-Origin': '*' }) : headers

const getResponseObject = (statusCode, headers, body, cors = true) => ({
    statusCode,
    headers: prepareHeaders(headers, cors),
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

const validateRequestParams = requiredParams => params => {
    const paramsKeys = Object.keys(params)
    return requiredParams.filter(key => !paramsKeys.includes(key))
}

const requestOAuth2AccessToken = (endpoint, clientId, clientSecret) => axios.post(
    endpoint,
    qs.stringify({ grant_type: 'client_credentials' }),
    {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        auth: {
            username: clientId,
            password: clientSecret
        }
    }
)

const getHeaderFromApiGatewayEvent = (name = name.toLowerCase(), event) => {
    const { headers = {} } = event
    const key = Object.keys(headers).filter(key => key.toLowerCase() == name.toLowerCase()).shift()
    return headers[key] || null
}

const handleBackendException = err => {
    if (!err.response)
        throw err
    const errResponse = err.response
    return getResponseObject(errResponse.status, {}, getErrorResponseBody(errResponse.data.message, 'Backend'))
}

module.exports = ({
    getSSMParameterValue,
    getResponseObject,
    getErrorResponseBody,
    log,
    logException,
    validateRequestParams,
    requestOAuth2AccessToken,
    getHeaderFromApiGatewayEvent,
    handleBackendException
})