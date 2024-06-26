const mongoose = require('mongoose')
const slugify = require('slugify')
 
const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        // unique: true,
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
    },

    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }

})

// Create slug from blog name
BlogSchema.pre('save', function(next){
    this.slug = slugify(this.title, { lower: true })
    console.log(`slugify ran: ${this.slug}`)
    next()
})

module.exports = mongoose.model('Blog',BlogSchema)