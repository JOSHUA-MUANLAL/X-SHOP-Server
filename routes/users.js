const router = require("express").Router();
const mongoose=require('mongoose');
const validate=require('../middleware/sendmail')
const authentication=require('../middleware/authentication')
const usercontroller=require('../controller/usercontroller')
const multer=require('multer')

router.post('/userlogin',async(req,res)=>{
    await usercontroller.UserLogin(req,res)
})

router.get('/getuserdata',authentication,async(req,res)=>{
    await usercontroller.getuserdata(req,res)
})

router.post('/getproductdetail',authentication,async(req,res)=>{
    await usercontroller.getproductdetail(req,res)
})

router.post('/addtowishlist',authentication,async(req,res)=>{
    await usercontroller.addtowishlist(req,res)
})
router.post('/removefromwishlist',authentication,async(req,res)=>{
    await usercontroller.removefromwishlist(req,res)
})

router.post('/removefromcart',authentication,async(req,res)=>{
    await usercontroller.removefromcart(req,res)
})

router.post('/addtocart',authentication,async(req,res)=>{
    await usercontroller.addtocart(req,res)
})

router.post('/orderproceed',authentication,async(req,res)=>{
    await usercontroller.orderproceed(req,res)
})

router.post('/userregister',async(req,res)=>{
    await usercontroller.userregister(req,res)
})

router.get('/getallproduct',authentication,async(req,res)=>{
    await usercontroller.getallproduct(req,res)
})

module.exports=router;