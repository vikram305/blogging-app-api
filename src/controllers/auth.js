const User = require('../models/User')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')

//@desc     Register user
//@route    POST /api/v1/auth/register
//@access   Public
exports.register = asyncHandler(async (req, res, next) => {
    const {name, email, password} = req.body

    let registeredUser = await User.findOne({ email })
    console.log(`registered user: ${registeredUser}`)

    if(registeredUser){
        return next(new ErrorResponse('User with this email already exist.', 400))
    }

    //Create User
    const user = await User.create({
        name,
        email,
        password
    })

    registeredUser = await User.findOne({ email })


    sendTokenResponse(registeredUser, 200, res)
})


//@desc     Login user
//@route    POST /api/v1/auth/login
//@access   Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password} = req.body

    // Validate email and password
    if(!email || !password){
        return next(new ErrorResponse('Please provide an email and password', 400))
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password')

    if(!user){
        return next(new ErrorResponse('Invalid credentials', 401))
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password)

    if(!isMatch){
        return next(new ErrorResponse('Invalid credentials', 401))
    }

    sendTokenResponse(user, 200, res)
})


//@desc     Get current logged in user
//@route    POST /api/v1/auth/me
//@access   Private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id)

    // console.log('user ', user)
    
    res.status(200).json({
        success: true,
        data: user
    })
})

//@desc     Forgot Password
//@route    POST /api/v1/auth/forgotpassword
//@access   Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    
    if(!req.body.email){
        return next(new ErrorResponse('Please provide an email', 400))
    }

    const user = await User.findOne({ email: req.body.email })

    // console.log('user ', user)

    if(!user){
        return next(new ErrorResponse('There is no user with this email',404))
    }

    // Get reset token
    const resetToken =  user.getResetPasswordToken()
    
    await user.save({ validateBeforeSave: false })

    // Create reset url
    const resetUrl = `${req.protocol}://${req.get('host')}api/v1/passwordreset/${resetToken}`

    const message = `You receiving this email because you (or someone else) has requested the reset of 
    a password. To reset the password please clik on the given link: \n\n ${resetUrl}`

    try{
        await sendEmail({
            email: user.email,
            subject: 'Password Reset',
            message: message,
            html: `<p>${message}</p> \n\n
            <h1><a href="${resetUrl}">  Click here to change password </a> </h1>`

        })

        res.status(200).json({ success: true, data: 'Email sent'})
    } catch(error){
        console.log(error)
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save({ validateBeforeSave: false })

        return next(new ErrorResponse('Email could not be sent',500))
    }

})

//@desc     Reset password
//@route    PUT /api/v1/auth/resetpassword/:resetToken
//@access   Public
exports.resetPassword = asyncHandler(async (req, res, next) => {

    // Get hased token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resetToken)
        .digest('hex')
    
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    // console.log('user ', user)

    if(!user){
        return next(new ErrorResponse('Invalid Token',400))
    }

    // Set new password
    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save()
     
    sendTokenResponse(user, 200, res)
})


// Get token from model, create cookie and send response
const sendTokenResponse = (userDetail, statusCode, res) => {
    // Create token
    const token = userDetail.getSignedJwtToken()


    //only removing password field from user object
    const user = userDetail.toObject()
    delete user.password
    console.log(`user: ${user}`)
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if(process.env.NODE_ENV === 'production'){
        options.secure = true
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            data: user,
            token
        })
}
