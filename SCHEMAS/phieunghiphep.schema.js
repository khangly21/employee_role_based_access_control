//schema này quy định document structure bao gồm {nhanvienId, title, date_array string, hour_array string, songaynghidangky, lydoxinnghiphep} 

const mongoose=require('mongoose');

const phieunghiphepSchema=new mongoose.Schema({
    title:{type: String, required: true},
    datearray_string:{type: Array, required: true}, //dùng type:Array được không ? 👉 https://mongoosejs.com/docs/schematypes.html
    hourarray_string:{type: Array, required: true},
    reason:{type: String, required: true},
    songaynghidangky:{type:Number, required: true},
    nhanvienId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'NHANVIEN'
    }
},
{timestamps: { createdAt: true, updatedAt: true }} 
)
module.exports = phieunghiphepSchema;