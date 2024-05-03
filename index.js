const express=require('express')
const app=express()
const cors=require('cors')
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const secretKey = 'joshua';
const sendmail=require('./middleware/sendmail')


const dealerroute=require('./routes/dealer')
const userroute=require('./routes/users')
const deliveryroute=require('./routes/delivery')
const {DealerModel}=require('./dbmodel/dealermodel')
const {UserModel}=require('./dbmodel/usermodel')
app.use(bodyParser.json());
const mongoose = require('mongoose');

app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());





app.post('/sentotp',async (req,res)=>{
    try{
        const email=req.body.email;
        const role=req.body.role;
        let result;
    if(role=='user'){
        result=await UserModel.findOne({userEmail:email})
    }else{
        result=await DealerModel.findOne({dealer_email:email})
    }

    if(!result){
      const otp=Math.floor(Math.random() * 900000) + 100000;

      let mailOptions={
        from:{
            name:'JCourse',
            address:'joshua00521202021@msijanakpuri.com'
        },
        to:email,
        subject:'One Time Password',
        text:'Passsword OTP',
        html:`<b>Dear User ${email}<br> Your OTP for Registartion is ${otp} </b>`
              }
        sendmail(mailOptions)
        res.status(200).json({otp:otp})

    }else{
      res.status(201).json({message:"Email Already Existed"})
    }

    }catch(error){
        console.log(error)
    }
})

app.use('/',userroute)
app.use('/',dealerroute)
app.use('/',deliveryroute)


console.log("woriking")

app.listen(8080, () => {
    console.log('Server is running on http://localhost:8080');
  })