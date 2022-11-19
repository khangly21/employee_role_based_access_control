const mongoose=require('mongoose');

const Luot_bat_dau_Luot_ket_thuc=new mongoose.Schema({
    Luot_bat_dau:{type: Date, required: true},
    Luot_ket_thuc:{type: Date, required: true},
    Khoang_thoi_gian_lam_viec:{type:}
});

//https://stackoverflow.com/questions/33791714/data-type-to-store-time-with-mongoose
const recordedKetThucLam =new mongoose.Schema(
    {   
       So_gio_da_lam_trong_ngay:{type:Number,required:true},
       //https://stackoverflow.com/questions/46302053/mongoose-express-create-schema-with-array-of-objects
       Danh_sach_cac_luot_batdau_ketthuc:[Luot_bat_dau_Luot_ket_thuc], //ReferenceError: Cannot access 'Luot_bat_dau_Luot_ket_thuc' before initialization, do đó Luot_bat_dau_Luot_ket_thuc phải đứng trước recordedKetThucLam
       comments: [{ body: String, date: Date }],
       //specify Schema for array's object
       body:String,
       date: { type: Date, default: Date.now },
       dong_y_chu: Boolean
    }, 
    {timestamps: { createdAt: true, updatedAt: true }} 
)


//chú ý: Schema({}), nhưng nếu có timestamps thì ở {} riêng. Thành Schema({},{})
module.exports = recordedKetThucLam;