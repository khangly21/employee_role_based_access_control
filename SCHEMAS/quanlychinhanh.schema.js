const mongoose=require('mongoose');

const quanlychinhanhSchema=new mongoose.Schema({
    Ho_ten:{
        type: String, 
        required: true
    },
    Ma_so:{type: String, required: true},
    Ten_Dang_nhap:{type: String, required: true},
    Mat_khau:{type: String, required:true},
    Chi_nhanh:{
        Ten:{type: String, required: true},
        Ma_so:{type: String, required: true}
    }
})

module.exports = quanlychinhanhSchema; 