//@desc     Get all blogs
//@route    GET /api/v1/blogs
//@access   Public
exports.getBlogs = (req,res,next) => {
    res.status(200).json({ success: true, message: 'Show all blogs' })
}

//@desc     Get single blogs
//@route    GET /api/v1/blogs/:id
//@access   Public
exports.getBlog = (req,res,next) => {
    res.status(200).json({ success: true, message: `Show blog ${req.params.id}` })
}

//@desc     Create new blog
//@route    POST /api/v1/blogs
//@access   Private
exports.createBlog = (req,res,next) => {
    res.status(200).json({ success: true, message: 'Create new blog' })
}

//@desc     Update blog
//@route    PUT /api/v1/blogs/:id
//@access   Private
exports.updateBlog = (req,res,next) => {
    res.status(200).json({ success: true, message: `Update blog ${req.params.id}` })
}

//@desc     Delete blog
//@route    DELETE /api/v1/blogs/:id
//@access   Private
exports.deleteBlog = (req,res,next) => {
    res.status(200).json({ success: true, message: `Delete blog ${req.params.id}` })
} 