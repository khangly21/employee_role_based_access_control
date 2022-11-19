const mongoose=require('mongoose');

const congtySchema=new mongoose.Schema({
    Ma_so:{
        type: String, required: true
    },
    Ten:{
        type: String, required: true
    },
    Dien_thoai:{
        type: String, required: true
    },
    Dia_chi:{
        type: String, required: true
    },
    Qui_dinh_Nhan_vien:{
        Ma_so:{type: String, required: true},
        Tuoi_Toi_thieu:{type: Number, required: true},
        Tuoi_Toi_da:{type: Number, required: true},
        Muc_luong_Toi_thieu:{type: Number, required: true}
    },
    Danh_sach_Ngoai_ngu:[
        {
            Ma_so:{type: String, required: true},
            Ten:{type: String, required: true}
        }
    ],
    Danh_sach_Quan_ly_Chi_nhanh:[
        {
            Ho_ten:{type: String, required: true},
            Ma_so:{type: String, required: true},
            Ten_Dang_nhap:{type: String, required: true},
            Mat_khau:{type: String, required: true},
            Chi_nhanh:{
                Ten:{type: String, required: true},
                Ma_so:{type: String, required: true}
            }
        }
    ],
    Danh_sach_Don_vi:[
        {
            Ma_so:{type: String, required: true},
            Ten:{type: String, required: true},
            Chi_nhanh:{
                Ma_so:{type: String, required: true},
                Ten:{type: String, required: true}
            }

        }
    ]
 
})

module.exports = congtySchema;  //khi đó require(path tới đây) sẽ là một đối tượng 
