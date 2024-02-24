const express = require('express')
const app = express()
const loginRouter = require('./controllers/loginRouter')
const registerRouter = require('./controllers/registerRouter')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const cors = require('cors')
const usersRouter = require('./controllers/usersRouter')
const blogRouter = require('./controllers/blogRouter')

logger.info("connecting to MongoDB")
mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info("connected to MongoDB")
    })
    .catch((error) => {
        logger.info("error connecting to MongoDB: ", error)
    })



app.use(express.json())
app.use(middleware.requestLogger)
app.use(cors())
app.use( '/api/login', loginRouter)
app.use( '/api/register', registerRouter)
app.use( '/api/users', usersRouter)
app.use('/api/blogs', blogRouter)

app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)


module.exports = app
