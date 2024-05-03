const {DealerModel}=require('../dbmodel/dealermodel')
const {UserModel}=require('../dbmodel/usermodel')
const {ItemModel}=require('../dbmodel/itemmodel')
const jwt = require('jsonwebtoken');
const { response } = require('express');
const sendmail=require('../middleware/sendmail')
const secretKey = 'joshua';
const bcrypt=require('bcrypt')
const { v4: uuidv4 } = require('uuid');
const Fuse = require('fuse.js');

class usercontroller{

    async getallproduct(req,res){
        try{
            let result=await ItemModel.find()
            if(result){
                res.status(200).json(result)
            }else{
                console.log("Failed to fetch all product")
            }

        }catch(error){
            console.log(error)
        }

    }


    async UserLogin(req,res){
        try{
            console.log("loging in user")
            let useremail=req.body.email;
            let password=req.body.password
            let result=await UserModel.findOne({userEmail:useremail})
            if(result){
                console.log("user found")
                
            let passwordcompare=bcrypt.compare(password,result.password)

            if(passwordcompare){
                console.log("password correct")

                const userPayload={
                    name:result.userName,
                    email:result.userEmail
                }
                
                const token = jwt.sign(userPayload, secretKey);
                console.log("3)Token signed");
                res.status(200).json({token})

            }else{
                res.json({message:"No user found"})
                
            }
            
            }else{console.log('user not found')
                res.status(404).json({message:'User Not Found'})
            }


        }catch(error){
            console.log("Error in login=> ",error)
            return res.status(404).json({ message: "Post Attendance: Internal Server Error" })
        }


    }

    async getuserdata(req,res){
        try{
            let useremail=req.userdetail.email;

            if(!useremail){
                res.status(202).json({ message:'please login again' })

            }

            let result=await UserModel.findOne({userEmail:useremail})
            if(result){
                console.log("User Data fetched")
                res.status(200).json(result)
            }else{
                res.status(404).json({message:"Unable to fetch user data"})
            }
        }catch(error){
            console.log(error)
            res.statuse(404).json({message:"Unable to fetch userdata"})
        }
    }

    async getproductdetail(req,res){
        try{
            let searchedItem=req.body.search_product;

            let result=await ItemModel.find()

           if(result){
            console.log("searching product")
            const fuse = new Fuse(result, {
                keys: ['item_type', 'item_name',], // Fields to search
                threshold: 0.4, // Adjust the threshold for more or less strict matching
              });
              
              
              const searchResults = fuse.search(searchedItem);
              
              // Get the original objects from the search results
              const matchingItems = searchResults.map((results) => results.item);
              console.log("product found")

              res.status(200).json(matchingItems);
           }else{
            res.status(404).json({message:"Didnt found the Searched item"})
           }




        }catch(error){
            console.log(error)
            res.status(404).json({message:error})
        }

    }

    async addtowishlist(req,res){
        try{
            let id=req.body.item;
            console.log("adding to wishlist")
            let email=req.userdetail.email;
            let userresult=await UserModel.findOne({userEmail:email})
            let itemtoadd= await ItemModel.findOne({product_id:id})
            let items={
                product_id:id,
                item_type:itemtoadd.item_type,
                dealerEmail:itemtoadd.dealerEmail,
                item_name:itemtoadd.item_name,
                item_price:itemtoadd.item_price
            }

            if(userresult && itemtoadd){
                userresult.wishlist.push(items)
                console.log(userresult.wishlist)
                userresult.save()
                .then(result=>{
                    console.log("done pushing")
                    res.status(200).json({message:"added to wishlist"})
                })
                .catch(error=>{
                   res.status(404).json({message:"failed to add  to wishlist"})
                })
            }else{
                console.log("no user found")
                res.json({message:'No User Found'})
            }


        }catch(error){
            console.log(error)
            res.status(404).json({message:error})
        }
    }

    async removefromwishlist(req,res){
        try{
            let itemtoremove=req.body.product_id;

            let email=req.userdetail.email;

            let result=await UserModel.findOne({userEmail:email})
            

            if(result){
                result.wishlist = result.wishlist.filter(obj => obj.product_id !== itemtoremove);
                await result.save()
                console.log("removed from wish list")
                res.status(200).json({ message: "Item removed from wishlist" });
            }else{
                res.status(404).json({ message: "Failed to remove" });
            }


        }catch(error){
            console.log("failed to remove from wishlist")
           res.status(404).json({message:error})
        }
    }



    async removefromcart(req,res){
        try{

            let email=req.userdetail.email;
            let result=await UserModel.findOne({userEmail:email})
            if(result){
                let product_id=req.body.product_id;
                result.cart = result.cart.filter(item => item.product_id !== product_id);

            }

            await result.save()

            res.status(200).json({message:'removed from cart'})

        }catch(error){
            console.log(error)
            res.json({message:error})
        }

    }

    async addtocart(req,res){
        try{
            let id=req.body.id;
            let email=req.userdetail.email;

            let result=await UserModel.findOne({userEmail:email})
            let itemtoadd= await ItemModel.findOne({product_id:id})
            let items={
                product_id:id,
                item_type:itemtoadd.item_type,
                dealerEmail:itemtoadd.dealerEmail,
                item_name:itemtoadd.item_name,
                item_price:itemtoadd.item_price
            }
            if(result && itemtoadd){
                result.cart.push(items)
                result.save()
            .then(response=>{
                console.log("add to cart")
                res.status(200).json({message:'add to cart'})
            })
            .catch(error=>{
                console.log(error)
                res.status(404).json({message:error})
            })
            }
            

        }catch(error){
            console.log(error)
        }
    }

    async orderproceed(req,res){
        try{
            let orders=req.body.order
            let email=req.userdetail.email;
          

            let userresult=await UserModel.findOne({userEmail:email})
            const today = new Date();

            for (const element of orders) {
                console.log(element)
                const productResult = await ItemModel.findOne({ product_id: element.product_id });
                let uniqueOrderId = uuidv4();
                if(productResult.item_quantity){
                    productResult.item_quantity=productResult.item_quantity-1
                }
                let otp=Math.floor(Math.random() * 900000) + 100000;
                productResult.orders.push({
                    order_id:uniqueOrderId,
                    customer_email:userresult.userEmail,
                    customer_name:userresult.userName,
                    quantity_ordered:1,
                    address:userresult.address,
                    state:userresult.state,
                    pin_code:userresult.pin_code,
                    order_date:today.toLocaleDateString('en-US'),
                    delivery_otp:otp
                })

                userresult.orders.push({
                    order_id:uniqueOrderId,
                    product_id:element.product_id,
                    item_type:element.item_type,
                    dealerEmail:element.dealerEmail,
                    item_price:element.item_price,
                    order_date:today.toLocaleDateString('en-US'),
                    delivery_otp:otp,
                
                })
                console.log(userresult.orders)

                userresult.cart=userresult.cart.filter(item => item.product_id !== element.product_id);
                console.log("CART",userresult.cart)
                let mailOptions={
                    from:{
                        name:'JCourse',
                        address:'joshua00521202021@msijanakpuri.com'
                    },
                    to:email,
                    subject:'Delivery One Time Password',
                    text:'Delivery OTP',
                    html:`<b>Dear User ${email}<br> Your OTP for Delivery of <br> Product ID ${element.product_id} <br> Product :- ${element.item_name} is ${otp} </b><br>Please do not share it with anyone else ubless it is the delivery guy`
                          }
                    sendmail(mailOptions)


                await productResult.save()
               
            }
            userresult.save()
             res.status(200).json({message:'order placed'})



        }catch(error){
            console.log(error)
             res.status(404).json({message:error})
        }
    }

    async userregister(req,res){
        try{
            console.log("User registering")
            let email=req.body.email;
            let password=req.body.password;
            let name=req.body.name;
            let dob=req.body.dob;
            let phone=req.body.phone;
            let address=req.body.address;
            let pin =req.body.pin;
            let state=req.body.state;

            let check=await UserModel.findOne({userEmail:email})

            if(check){

            }else{
                const saltRounds=10;
                const hashedPassword=await bcrypt.hash(password, saltRounds)

                const user=new UserModel({
                    userEmail:email,
                    userName: name,
                    phone:phone,
                    dob:dob,
                    password:hashedPassword,
                    address:address,
                    state:state,
                    pin_code:pin,
                })

                console.log("User data inserted")
                
                user.save()
                .then(result=>{
                    console.log("user data saved")
                    let mailOptions={
                        from:{
                            name:'JCourse',
                            address:'joshua00521202021@msijanakpuri.com'
                        },
                        to:email,
                        subject:'Registration Complete',
                        text:'Registration Complete',
                        html:`<b>Welcome! User ${name}<br> Thank you For Registering With Us<br><br>Hope You will Love our webpage</b>`
                              }
                      sendmail(mailOptions)
                    res.status(200).json({message:'user Registered'})
                })
                .catch(error=>{
                    console.log(error)
                    res.status(404).json({message:error})
                })
            }



        }catch(error){
            res.json({message:error})
        }
    }



}

module.exports=new usercontroller;