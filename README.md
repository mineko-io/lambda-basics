# Lambda Basics
[![Build Status](https://travis-ci.org/mineko-io/lambda-basics.svg?branch=master)](https://travis-ci.org/mineko-io/lambda-basics) [![Maintainability](https://api.codeclimate.com/v1/badges/cf46c9ec91c8de23c659/maintainability)](https://codeclimate.com/github/mineko-io/lambda-basics/maintainability)

This module provides a set of useful functions for lambda.

## Methods:

* `getSSMParameterValue(parameterName)`: Will return a decrypted value of given parameter
* `getResponseObject(statusCode, headers, body)`: Will return a response object where the body is json string
* `getErrorResponseBody(message, type)`: Wil lreturn a error response body
* `log(message)`: Will console.log a message and send it to sentry
* `logException(exception)`: Will console.log a message and send it to sentry
* `validateRequestParams(requiredParams)(params)`: Will return a function which will check if `params` contains `requiredParams` 

## Usage
Just add the package to your deployment package to lambda.

### Install
```bash
npm i -S @mineko-io/lambda-basics
```