const router=require('express').Router()
const {getAllUsersCtrl , getUserProfileCtrl, updateUserProfileCtrl} = require('../Controllers/userController')
const { verifyTokenAndAdmin, verifyTokenAndUser } = require('../middlewares/verifyToken')
const validateObjectId = require('../middlewares/validateObjectId')

// /api/users/profile 
router.route('/profile').get(verifyTokenAndAdmin,getAllUsersCtrl)

// /api/users/profile/:id
router.route('/profile/:id')
    .get(validateObjectId,getUserProfileCtrl)
    .put(validateObjectId,verifyTokenAndUser,updateUserProfileCtrl)

module.exports=router