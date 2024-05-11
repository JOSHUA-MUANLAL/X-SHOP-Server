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
      
        const userExists = await UserModel.findOne({ userEmail: email });
        const dealerExists = await DealerModel.findOne({ dealer_email: email });
  

    if(!userExist && !dealerExists){
      const otp=Math.floor(Math.random() * 900000) + 100000;

      let mailOptions={
        from:{
            name:'X SHOP',
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

app.post('/resetotp',async (req,res)=>{
  try{
      const email=req.body.email;
    
      const userExists = await UserModel.findOne({ userEmail: email });
      const dealerExists = await DealerModel.findOne({ dealer_email: email });


  if(userExist || dealerExists){
    const otp=Math.floor(Math.random() * 900000) + 100000;

    let mailOptions={
      from:{
          name:'X SHOP',
          address:'joshua00521202021@msijanakpuri.com'
      },
      to:email,
      subject:'One Time Password',
      text:'Passsword OTP',
      html:`<b>Dear User ${email}<br> Your OTP for Password Reset is ${otp} </b>`
            }
      sendmail(mailOptions)
      res.status(200).json({otp:otp})

  }else{
    res.status(201).json({message:"Email Not Found"})
  }

  }catch(error){
      console.log(error)
  }
})



app.post('/resetpassword',async(req,res)=>{
  try{
    let email=req.body.email;
    let password=req.body.password;

    const saltRounds=10;
    const hashedPassword=await bcrypt.hash(password, saltRounds)

    users=await UserModel.findOne({userEmail:email})
    dealers=await DealerModel.findOne({dealer_email:email})

    if(users){
      users.password=hashedPasswordpassword;
      await users.save()
      res.json(200).json({message:'Reset password'})

    }else if(dealers){
      dealerroute.password=hashedPasswordpassword;
      await dealers.save()
      res.json(200).json({message:'Reset password'})
    }else{
      res.json({message:"Email Invalid"})
    }

  }catch(error){
    console.log(error)
    res.json({message:error})
  }
})



app.get('/', (req, res) => {
    res.redirect('https://joshua-muanlal.github.io/X-SHOP-frontend/'); // External redirect
    // If you meant to redirect within your app, adjust the path accordingly
  });
app.use('/',userroute)
app.use('/',dealerroute)
app.use('/',deliveryroute)


console.log("woriking")

app.listen(3000, () => {
    console.log('Server is running on http://localhost:8080');
  })