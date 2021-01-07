const mongoose = require('mongoose')
 
const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        unique: true,
        trim: true,
        maxlength: [100, 'Title can not be more than 100 characters']
    },

    slug: String,
    body: {
        type: String,
        required: [true, 'Please add a body'],
        unique: false,
        trim: true,
        maxlength: [500, 'Body can not be more than 500 characters']
    },

    image: {
        type: String,
        default: 'no-photo.jpg'
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('Blog',BlogSchema)