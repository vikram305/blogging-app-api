const express = require('express');
const { register, login, getMe, forgotPassword, resetPassword, updateDetails, updatePassword } = require('../controllers/auth')
const { protect } = require('../middleware/auth')
const path = require('path')

const router = express.Router()
 
router.post('/register', register)
router.post('/login', login)
router.get('/me', protect, getMe)
router.put('/updatedetails', protect, updateDetails)
router.put('/updatepassword', protect, updatePassword)
router.post('/forgotpassword', forgotPassword)
router.put('/resetpassword/:resetToken', resetPassword)
router.get('/passwordreset/:resetToken', function(req, res) {
    const dirName = path.join(__dirname, '../../public/')
    console.log('dir name: ',dirName)
    res.sendFile(path.join(dirName,'/resetpassword.html'))
})

module.exports = router