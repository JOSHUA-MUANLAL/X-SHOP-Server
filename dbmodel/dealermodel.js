const connection=require('./dbconnection')
const mongoose = require('mongoose');

try{
    const dealerSchema = new mongoose.Schema({
       dealer_email:String,
       dealer_name:String,
       password:String,
       company_name:String,
       dealer_number:Number,
       address:String,
       pin:Number,
      
      });
      
      
      
      
      
      // Create the User model
      const DealerModel = connection.model('dealerdata', dealerSchema);
      console.log("connected",DealerModel);
      
      // Export the User model
      module.exports = {DealerModel};

}catch(error){
    console.log("Error in Usermodel:-\n",error)
}