const mongoose=require('mongoose');

const adminSchema=new mongoose.Schema({
    Ten_dang_nhap:{type: String, required:true},
    Mat_khau:{type: String, required:true}
})

module.exports=adminSchema;   //export 1 instance