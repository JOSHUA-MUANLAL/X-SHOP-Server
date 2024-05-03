const router = require("express").Router();
const mongoose=require('mongoose');
const validate=require('../middleware/sendmail')
const authentication=require('../middleware/authentication')
const dealercontroller=require('../controller/dealercontroller')
const multer=require('multer')


const storage = multer.memoryStorage();
const upload = multer({ storage });


router.post("/addproducts",authentication,upload.array('images'),async (req,res)=>{
    try{

        const newImages = req.files.map((file) => ({
            imageData: file.buffer.toString('base64'),
            mimeType: file.mimetype,
          }));

        await dealercontroller.addproducts(req,res,newImages);
          





    }catch(error){
        console.log(error)
        res.status(404),json({message:"error adding product"})
    }
})

router.post('/dealerlogin',async(req,res)=>{
    try{
        await dealercontroller.dealerlogin(req,res);
        

    }catch(error){
        console.log(error)
        res.status(404).json({message:"error login "})
    }
})

router.get('/getdealerdata',authentication,async(req,res)=>{
    await dealercontroller.getdealerdata(req,res)
})


router.post('/dealerregister',async(req,res)=>{
    await dealercontroller.registerdealer(req,res)
})

router.get('/getdealerproductdetail',authentication,async(req,res)=>{
    await dealercontroller.getproductdetail(req,res)
})

module.exports=router;