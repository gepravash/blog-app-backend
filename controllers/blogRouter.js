const blogRouter = require('express').Router()
const { User, Blog } = require('../models/Model')
const logger = require('../utils/logger')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')


blogRouter.get('/', async (request, response, next) => {
    try
    {
        const blogs = await Blog.find({}).populate({path: 'author', select: 'name'})
        logger.info(blogs)
        response.send(blogs)
    }
    catch(error)
    {
        next(error)
    }
})

blogRouter.get('/:id', async (request, response, next) => {
    try 
    {
        const blog = await Blog.find({_id: request.params.id})
        response.send(blog)
    }
    catch(error)
    {
        next(error)
    }
})

blogRouter.post('/', async (request, response, next) => {
    try 
    {
        console.log(request.headers.authorization)
        const token = request.headers.authorization.split(" ")[1]
        await jwt.verify(token, config.SECRET_KEY)
        console.log(token)
        console.log(request.body)
        console.log(request.body.title)
        const blog = await new Blog({
            title: request.body.title,
            content: request.body.blog,
            author: request.body.id,
        })

        await blog.save()

        const user = await User.findOne({_id: request.body.id})
        logger.info(user)
        user.blog.push(blog._id)

        console.log(user)

        await user.save()

        logger.info(blog)

        response.send(request.body)
    }
    catch(error)
    {
        next(error)
    }
})

blogRouter.post('/like', async (request, response, next) => {
    try 
    {
        console.log(request.body)
        const blog = await Blog.findOne({title: request.body.title})
        
        console.log(">>>>>>",blog)
        console.log(">>>>", blog.like)
        console.log(request.body.id)
        if (blog.like.includes(request.body.id))
        {
            blog.like = blog.like.filter(liker => liker != request.body.id )
            await blog.save()
            response.send(blog)
            return
        }

        blog.like.push(request.body.id)
        await blog.save()
        console.log(blog)
        response.send(blog)
    }
    catch(error)
    {
        next(error)
    }
})

module.exports = blogRouter
