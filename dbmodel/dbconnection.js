const mongoose=require('mongoose')

const connection=mongoose.createConnection('mongodb://localhost:27017/shopi',{ useNewUrlParser: true, useUnifiedTopology: true });

connection.on('connected', () => {
    console.log('MongoDB connection established successfully');
  });
  
  connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });
  
  connection.on('disconnected', () => {
    console.log('MongoDB connection disconnected');
  });

module.exports=connection