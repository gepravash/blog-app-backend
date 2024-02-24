const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: String,
    username: {
        type: String,
        unique: true
    },
    passwordHash: String,
    follow: [{type: mongoose.Schema.Types.ObjectId,
                ref: 'User'}],
    follower: [{type: mongoose.Schema.Types.ObjectId,
        ref: 'User'}],
    blog: [{type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'}]
})

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true
    },
    content: {
        type: String,
        minlength: 3
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    like: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
        required: true
    }]
})

mongoose.set('toJSON',{
transform:(document, returnedObject) => {
    returnedObject._id = returnedObject._id.toString()
    delete returnedObject.__v
}
})

// mongoose.set('toObject', {
//     transform: (document, returnedObject) => {
//         returnedObject._id = returnedObject._id.toString()
//         delete returnedObject.__v
//     }
// })

const User = mongoose.model('User', userSchema)
const Blog = mongoose.model('Blog', blogSchema)

module.exports = {
    User,
    Blog
}