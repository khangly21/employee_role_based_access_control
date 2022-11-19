const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const nhanvienKhaiCovidSchema=new mongoose.Schema({

    Than_nhiet:{type: Number, required: true},   //36.7

    Vaccine1:{type: String}, 
    Vaccine2:{type: String}, 
    Vaccine3:{type: String}, 
    Vaccine4:{type: String}, 
 
    HangSX_mui_1:{type: String},
    Ngay_tiem_mui_1:{type: Date},

    HangSX_mui_2:{type: String},
    Ngay_tiem_mui_2:{type: Date},

    HangSX_mui_3:{type: String},
    Ngay_tiem_mui_3:{type: Date},

    HangSX_mui_4:{type: String},
    Ngay_tiem_mui_4:{type: Date},

    Ket_qua_xet_nghiem:{type: String, required: true},

    nhanvienId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'NHANVIEN'
    }

})

module.exports = nhanvienKhaiCovidSchema;