
const {ItemModel}=require('../dbmodel/itemmodel')
const {DealerModel}=require('../dbmodel/dealermodel')
const {UserModel}=require('../dbmodel/usermodel')
const { v4: uuidv4 } = require('uuid');
const sendmail=require('../middleware/sendmail')
const bcrypt=require('bcrypt')

const jwt = require('jsonwebtoken');
const secretKey = 'joshua';


class delivery{

    async getdeliverydata(req,res){
        try{
            
            let result=await ItemModel.find();
            if(result){
                console.log('Got delivery data')
                
                res.status(200).json(result)
            }else{
                res.status(404).json({message:"error getting data"})
            }


        }catch(error){
            console.log(error)
            res.status(404).json({message:error})
        }

    }



    async checkdeliveryotp(req,res){
        try{

            let otp=req.body.otp;
            let id=req.body.order_id;
            let email=req.body.email;
            let product_id=req.body.product_id;

            let result=await ItemModel.updateOne(
                {
                    product_id:product_id,
                  "orders.order_id": id, 
                  "orders.delivery_otp": otp, 
                },
                {
                  $set: {
                    "orders.$.order_status": true, 
                  },
                }
              )


              let result2=await UserModel.updateOne(
                {
                  userEmail: email, // Match the user by email
                  'orders.order_id': id, // Find where the order ID matches
                  'orders.delivery_otp': otp, // Ensure the OTP matches
                },
                {
                  $set: {
                    'orders.$.order_status': true, // Set the order status to true
                  },
                }
              );
              console.log(result,"\n",result2)

              if (result.nModified > 0 && result2.nModified>0) {

                let mailOptions={
                    from:{
                        name:'JCourse',
                        address:'joshua00521202021@msijanakpuri.com'
                    },
                    to:email,
                    subject:'Order delivered',
                    text:'Order Delivered',
                    html:`<b>Dear User ${email}<br> Your Product ${product_id} and Order id: ${id} have been deliveredy<br>Thanks shopping with us`
                          }
                    sendmail(mailOptions)


                console.log("delivered")
                res.status(200).json({message:"Order delivered"})
              }else{
                console.log("not delivered ")
                res.status(200).json({message:'OTP is wrong'})
              }

        }catch(error){
            console.log(error)
            res.status(404).json({error})
        }

    }
}

module.exports=new delivery