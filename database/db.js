var mongoose = require("mongoose");

exports.connect = ()=>{
  // Connect with mongodb instance 
    mongoose.connect(process.env.MONGO_URI,(err)=>{
      if(err) console.log(err);
      console.log("mongoose connected");
    }); 
}