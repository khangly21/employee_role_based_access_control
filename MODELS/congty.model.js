const mongoose=require('mongoose');

//https://www.geeksforgeeks.org/mongoose-mongoose-model-function/
module.exports=mongoose.model('CONGTY', require('../SCHEMAS/congty.schema'));//chạy hàm model() và tạo Mongoose model là CONGTY
//export một đối tượng scollections