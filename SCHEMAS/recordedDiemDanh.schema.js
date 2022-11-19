const mongoose=require('mongoose');

const recordedAttendance =new mongoose.Schema(
    {   
        Ten_Nhan_vien:{type: String, required: true}, 
        Noi_Lam_viec:{type: String, required: true},
        //Thoi_gian_bat_dau_theo_server: {type:Date,required: true,default:Date.now}  //idea: so sánh Thoi_gian_bat_dau_theo_server và createdAt, khi đó nhà quản lý xác nhận
        //server time là Date.now()
        Thoi_gian_bat_dau_theo_server:{type:String,required: true}
    }, 
    {timestamps: { createdAt: true, updatedAt: true }} 
)
//chú ý: Schema({}), nhưng nếu có timestamps thì ở {} riêng. Thành Schema({},{})
module.exports = recordedAttendance;