const registerRouter = require('express').Router()
const bcrypt = require('bcrypt')
const { User, Blog } = require('../models/Model')
const logger = require('../utils/logger')

registerRouter.post('/', async (request, response, next) => {
    try
    {
    const passwordHash = await bcrypt.hash(request.body.password, 10)

    const user = await new User({
        name: request.body.name,
        username: request.body.username,
        passwordHash: passwordHash
    })

    await user.save()
    logger.info(">>",user)

    response.send(request.body)
    }
    catch(error)
    {
        next(error)
    }
})

module.exports = registerRouter