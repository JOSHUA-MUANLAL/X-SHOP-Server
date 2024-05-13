const connection=require('./dbconnection')
const mongoose = require('mongoose');

try{
    const itemSchema = new mongoose.Schema({
        product_id:String,
        dealerEmail:String,
        dealerName: String,
        item_type:String,
        item_name:String,
        quality_rating:String,
        item_price:Number,
        item_quantity:Number,
        company:String,
        address:String,
        description:String,
        images: [
            {
              imageData: { type: String, required: true },
              mimeType: { type: String, required: true },
            },
          ],
          orders:[
            {   order_id:String,
                customer_email:String,
                customer_name:String,
                quantity_ordered:Number,
                address:String,
                state:String,
                pin_code:Number,
                order_date:Date,
                order_status:{
                    type:Boolean,
                    default:false
                },
                delivery_otp:Number
            }
           ],
      });
      
      
      
      
      
      // Create the User model
      const ItemModel = connection.model('itemdatarecord', itemSchema);
      console.log("connected",ItemModel);
      
      // Export the User model
      module.exports = {ItemModel};

}catch(error){
    console.log("Error in Usermodel:-\n",error)
}