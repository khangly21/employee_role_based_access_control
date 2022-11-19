const mongoose=require('mongoose');

//export một Mongoose model
module.exports=mongoose.model("ADMIN",require('../SCHEMAS/admin.schema'));