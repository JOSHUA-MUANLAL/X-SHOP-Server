const connection=require('./dbconnection')
const mongoose = require('mongoose');

try{
    const userSchema = new mongoose.Schema({
       
        userEmail:String,
        userName: String,
        phone:Number,
        dob:String,
        password:String,
        address:String,
        state:String,
        pin_code:Number,
        wishlist:[
          {
            product_id:String,
            item_type:String,
            dealerEmail:String,
            item_name:String,
            item_price:Number
          }
        ],
        cart:[
          {
            product_id:String,
            item_type:String,
            dealerEmail:String,
            item_name:String,
            item_price:Number
          }
        ],
        orders:[
          {
            product_id:String,
            item_type:String,
            dealerEmail:String,
            item_name:String,
            item_price:Number
          }

        ]
      });
      
      
      
      
      
      // Create the User model
      const UserModel = connection.model('userrecorddata', userSchema);
      console.log("connected",UserModel);
      
      // Export the User model
      module.exports = {UserModel};

}catch(error){
    console.log("Error in Usermodel:-\n",error)
}