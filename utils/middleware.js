const logger = require('./logger')

const requestLogger = (request, response, next) => {
    logger.info('Method: ', request.method)
    logger.info('Path: ', request.path)
    logger.info('Body: ', request.body)
    logger.info('headers: ', request.headers)
    logger.info('----------------')
    next()
}

const requestBodyTrimmer = (request, response, next) => {
    request.body.name = request.body.name.trim()
    request.body.username = request.body.username.trim()
    next() 
}

const errorHandler = (error, request, response, next) => {
    logger.info(error.name + ": " + error.message)

    if (error.name === "UsernameNotFound")
    {
        response.status(400).send({error: error.message}).end()
        return
    }

    if (error.name === "PasswordIncorrect")
    {
        response.status(401).send({error: error.message}).end()
        return
    }

    if (error.name === "CastError")
    {
        response.status(400).send({error: error.message}).end()
        return
    }

    if (error.name === "MongoServerError")
    {
        if (error.message.includes("duplicate") && error.message.includes("username"))
        {
            response.status(400).send({error: "Username already exist."}).end()
            return
        }
        response.status(400).send({error: error.message}).end()
        return
    }

    if (error.name === "ValidationError")
    {
        response.status(400).send({error: error.message}).end()
        return
    }
    next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

module.exports = {
    requestLogger,
    requestBodyTrimmer,
    errorHandler,
    unknownEndpoint
}