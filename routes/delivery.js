const router = require("express").Router();
const mongoose=require('mongoose');
const validate=require('../middleware/sendmail')
const authentication=require('../middleware/authentication')
const deliverycontroller=require('../controller/deliverycontroller')
const multer=require('multer')


router.get('/getdeliverydata',async(req,res)=>{
    await deliverycontroller.getdeliverydata(req,res)
})

router.post('/checkdeliveryotp',async(req,res)=>{
    await deliverycontroller.checkdeliveryotp(req,res)
})

module.exports=router