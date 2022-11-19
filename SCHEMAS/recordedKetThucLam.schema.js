const mongoose=require('mongoose');

const Luot_bat_dau_Luot_ket_thuc=new mongoose.Schema({
    Luot_bat_dau:{type: String, required: true},
    Luot_ket_thuc:{type: String, required: true},
    Noi_lam_viec:{type:String,required: true},
    So_phut_phien_lam_viec:{type:Number, required: true}
});


const recordedKetThucLam =new mongoose.Schema(
    {
       Ho_ten:{type:String, required: true},
       Ma_so_nguoi_checkout:{type:String, required: true},
       //So_gio_da_lam_hom_nay:{type:Number,required:true}, //số thực
       
       //Thoi_gian_checkout_nhanvien_ghi:{type:String,required: true},
       //https://stackoverflow.com/questions/46302053/mongoose-express-create-schema-with-array-of-objects
       //Cách 1:
          ///Danh_sach_cac_luot_batdau_ketthuc:[Luot_bat_dau_Luot_ket_thuc]
       //Cách 2:
       Danh_sach_cac_luot_batdau_ketthuc:{type:[Luot_bat_dau_Luot_ket_thuc],required:true}, //ReferenceError: Cannot access 'Luot_bat_dau_Luot_ket_thuc' before initialization, do đó Luot_bat_dau_Luot_ket_thuc phải đứng trước recordedKetThucLam
       //Kết luận: cả 2 cách trên đều không mở mảng trong MongoDb được 👉 Assignment2_phan27 sẽ thực hiện cách 2 sẽ thấy do CastError tại Luot_bat_dau failed casting string to date type
       //Cách 3 (trực tiếp, của tác giả Maxi)
       /*
            const orderSchema = new Schema({
                 products: [
                   {
                     product: { type: Object, required: true },
                     quantity: { type: Number, required: true }
                   }
                 ],
                 user: {
                   email: {
                     type: String,
                     required: true
                   },
                   userId: {
                     type: Schema.Types.ObjectId,
                     required: true,
                     ref: 'User'
                   }
                 }
            });
        */
       
       nhanvienId: {
           type: mongoose.Schema.Types.ObjectId,
           required: true,
           ref: 'NHANVIEN'
       }
    }, 
    {timestamps: { createdAt: true, updatedAt: true }} 
)


//chú ý: Schema({}), nhưng nếu có timestamps thì ở {} riêng. Thành Schema({},{})
module.exports = recordedKetThucLam;