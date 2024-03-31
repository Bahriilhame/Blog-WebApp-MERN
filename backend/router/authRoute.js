const router=require('express').Router()
const {registerUserCtrl}=require("../Controllers/authController")

// /api/auth/register 
router.post('/register',registerUserCtrl)

module.exports=router