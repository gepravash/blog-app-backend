const loginRouter = require('express').Router()
const { User, Blog } = require('../models/Model')
const logger = require('../utils/logger')
const bcrypt = require('bcrypt')
const config = require('../utils/config')
const jwt = require('jsonwebtoken')

loginRouter.post('/', async (request, response, next) => {
    try
    {
        logger.info(request.body)
        const user = await User.findOne({username: request.body.username})
        if (user === null)
        {
            const error = new Error("Username provided is not found.")
            error.name = "UsernameNotFound"
            throw error
        }

        logger.info(user)
        const passwordCorrect = await bcrypt.compare(request.body.password, user.passwordHash)
        if (passwordCorrect === false)
        {
            const error = new Error("Password is not correct.")
            error.name = "PasswordIncorrect"
            throw error
        }
        
        logger.info("passwordCorrect: ", passwordCorrect)

        const userForToken = {
            name: user.name,
            username: user.username,
            id: user._id
        }

        const token = jwt.sign(userForToken, config.SECRET_KEY)


        response.send({token, username: user.username, name: user.name, id: user._id})
    }
    catch(error)
    {
        next(error)
    }
})

module.exports = loginRouter