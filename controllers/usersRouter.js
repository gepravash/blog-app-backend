const usersRouter = require('express').Router()
const { User } = require('../models/Model')
const logger = require('../utils/logger')

usersRouter.get('/', async (request, response, next) => {
    try
    {
        const users = await User.find({})
        logger.info(users)
        response.send(users)
    }
    catch(error)
    {
        next(error)
    }
})

module.exports = usersRouter