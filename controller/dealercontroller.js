
const {ItemModel}=require('../dbmodel/itemmodel')
const {DealerModel}=require('../dbmodel/dealermodel')
const {UserModel}=require('../dbmodel/usermodel')
const { v4: uuidv4 } = require('uuid');
const sendmail=require('../middleware/sendmail')
const bcrypt=require('bcrypt')

const jwt = require('jsonwebtoken');
const secretKey = 'joshua';

class dealercontroller{

    async addproducts(req,res,newImages){

        try{
            let email=req.userdetail.email,name=req.userdetail.name;
            let re=await DealerModel.findOne({dealer_email:email})

            let product_name=req.body.productname,product_quantity=req.body.quantity,product_type=req.body.product_type,product_price=req.body.product_price;
            let uniqueProductId = uuidv4();
            let result=new ItemModel({
                product_id:uniqueProductId,
                dealerEmail:email,
                dealerName: name,
                item_type:product_type,
                item_name:product_name,
                item_price:product_price,
                item_quantity:product_quantity,
                images:newImages,
                company:re.company_name,
                address:re.address
            })
            
            result.save()
            .then(response=>{
                res.status(200).json({message:"Product added successfully"})
            })
            .catch(error=>{
                console.log(error)
                res.status(404).json(error)
            })
            



        }catch(error){
            console.error(message.error)
        }

    }


    async dealerlogin(req,res){
        try{
            console.log("here")
            let email=req.body.email;
            let password=req.body.password;

            let result=await DealerModel.findOne({dealer_email:email})
            console.log(result)

            if(result){
                console.log("user found")
                let compare=await bcrypt.compare(password,result.password)
                if(compare){
                    const userPayload={
                        name:result.dealer_name,
                        email:result.dealer_email
                    }
                    
                    const token = jwt.sign(userPayload, secretKey);
                    console.log("3)Token signed");
                    res.status(200).json({token})
                }else{console.log("user not found")
                    res.status(404).json({message:"Incorrect Password"})
                }
            }else{
                res.status(404).json({message:"User not Found"})
            }

        }catch(error){
            console.error(error)
        }
    }


    async getproductdetail(req,res){
        try{
            let email=req.userdetail.email;
            let result=await ItemModel.find({dealerEmail:email})

            if(result){
                res.status(200).json(result)
            }else{
                res.status(404).json({message:"No product"})
            }


        }catch(error){
            console.log(error)
        }
    }


    async registerdealer(req,res){
        try{
            let email=req.body.email;
            let password=req.body.password;
            let name=req.body.name;
            let dob=req.body.dob;
            let phone=req.body.phone;
            let address=req.body.address;
            let pin =req.body.pin;
            let company=req.body.company;
            let state=req.body.state;

            let check=await DealerModel.findOne({dealer_email:email})

            if(check){
                console.log("dealer existed")
                res.status(404).json({message:'Dealer Exist'})
            }else{
                const saltRounds=10;
                const hashedPassword=await bcrypt.hash(password, saltRounds)

                const dealer=new DealerModel({
                    dealer_email:email,
                    dealer_name:name,
                    password:hashedPassword,
                    company_name:company,
                    dealer_number:phone,
                    pin:pin,
                    address:address,
                    state:state

                })
                console.log("Detail inserted")

                dealer.save()
                .then(result=>{
                    console.log("4)db saved")
                    let mailOptions={
                      from:{
                          name:'JCourse',
                          address:'joshua00521202021@msijanakpuri.com'
                      },
                      to:email,
                      subject:'Registration Complete',
                      text:'Registration Complete',
                      html:`<b>Welcome! Dealer ${name}<br> Thank you For Registering With Us<br><br>Hope You will Love our webpage</b>`
                            }
                    sendmail(mailOptions)
                   
                    console.log("5)done registration");
                    res.status(200).json({ message: 'Registered' });
                })
                .catch(error=>{
                    console.log(error)
                    res.status(404).json({message:"Failed to register"})
                })

            }

        }catch(error){
            console.log(error)
        }
    }

    async getdealerdata(req,res){
        try{
            console.log("fetching dealer data")
            let email=req.userdetail.email;

            let result=await DealerModel.findOne({dealer_email:email})

            if(result){
                console.log("dealer ddata found")
                res.status(200).json(result)
            }else{
                console.log("No dealer data found")
                res.status(404).json({message:'No dealer data found'})
            }

        }catch(error){
            console.log(error)
        }
    }






}

module.exports=new dealercontroller;