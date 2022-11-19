const {validationResult} = require('express-validator')  //không phải require('validation')
const nhanvienMongooseModel=require('../MODELS/nhanvien.model');
const ToKhaiCovidNhanvien = require('../MODELS/nhanvienToKhaiCovid');
const phieuDiemDanhNhanVien=require('../MODELS/recordedDiemDanh.model');
const ModelPhieuCheckOutNhanvien=require('../MODELS/recordedKetThucLam.model');
const ModelPhieuNghiPhep=require('../MODELS/phieunghiphep.model');


//Chuỗi HTML trải ra nhiều dòng nên dùng ` ` 
//W3.CSS
const Chuoi_HTML_contact_us=`
        <form action="" class="w3-container w3-card-4 w3-light-grey w3-text-blue w3-margin">
            <h2 class="w3-center">Contact Us</h2>
             
            <div class="w3-row w3-section">
              <div class="w3-col" style="width:50px"><i class="w3-xxlarge fa fa-user"></i></div>
                <div class="w3-rest">
                  <input class="w3-input w3-border" name="first" type="text" placeholder="First Name">
                </div>
            </div>
            
            <div class="w3-row w3-section">
              <div class="w3-col" style="width:50px"><i class="w3-xxlarge fa fa-user"></i></div>
                <div class="w3-rest">
                  <input class="w3-input w3-border" name="last" type="text" placeholder="Last Name">
                </div>
            </div>
            
            <div class="w3-row w3-section">
              <div class="w3-col" style="width:50px"><i class="w3-xxlarge fa fa-envelope-o"></i></div>
                <div class="w3-rest">
                  <input class="w3-input w3-border" name="email" type="text" placeholder="Email">
                </div>
            </div>
            
            <div class="w3-row w3-section">
              <div class="w3-col" style="width:50px"><i class="w3-xxlarge fa fa-phone"></i></div>
                <div class="w3-rest">
                  <input class="w3-input w3-border" name="phone" type="text" placeholder="Phone">
                </div>
            </div>
            
            <div class="w3-row w3-section">
              <div class="w3-col" style="width:50px"><i class="w3-xxlarge fa fa-pencil"></i></div>
                <div class="w3-rest">
                  <input class="w3-input w3-border" name="message" type="text" placeholder="Message">
                </div>
            </div>
            
            <button class="w3-button w3-block w3-section w3-blue w3-ripple w3-padding">Send</button>
        
        </form>
    `

exports.getLogin=(req,res,next)=>{
    
    console.log("tại getlogin, req.session.user là:",req.session.user);

    //gửi dữ liệu động để view xử lý hiển thị
    res.render('login_mobile_w3css',{
        role:'nhanvien', //cho cả dieu_huong.ejs và  login_mobile_w3css.ejs
        //biến sau giúp cho view xử lý không hiển thị nút Login trên thanh dieu_huong
        pageLogin:true,  //đang ở trang Login (dieu_huong.ejs)
        pageRegister:false,  //không đang ở trang Signup (dieu_huong.ejs)
        //pageLogout:true,  // unused variable (dieu_huong.ejs)
        errorMessage:"",
        isLoggedIn:req.session.user  //dynamic based on user. Do dieu_huong.ejs dùng biến tên isLoggedIn, nên cả nhanvien và admin phải dùng tên biến này
    });
};

exports.getPhieuNghiPhep=(req,res,next)=>{
    const user= req.user;
    if(user.annualLeave===0){ //NV_2
        return res.render("phieunghiphep",{
            role:'nhanvien',  
            pageRegister:true,
            isLoggedIn:req.session.user, 
            message:"Bạn không còn ngày annualLeave nào để được đăng ký nghỉ phép",  
            nhanvien:user,  
            so_h_annualLeave:(req.user.annualLeave*24).toFixed(2) 
        })
    }
    res.render("phieunghiphep",{
        role:'nhanvien',  
        pageRegister:true,
        isLoggedIn:req.session.user, 
        message:"Mời bạn để lại thông tin đăng ký nghỉ phép",
        nhanvien:user,  
        so_h_annualLeave:(req.user.annualLeave*24).toFixed(2) , 
    })  
    
}

exports.getPersonalProfile=(req,res,next)=>{
    
    let isLoggedInNhanvien=req.user;
    console.log("Nhân viên đang login là", isLoggedInNhanvien); //✔️
    res.status(200).render('nhanvien/nhanvienProfile',{
        message: 'Congratulation successfully login',
        role:'nhanvien',  //cho cả dieu_huong.ejs và  login_mobile_w3css.ejs
        pageLogin:true,  //cho dieu_huong.ejs
        pageRegister:true,  //cho dieu_huong.ejs
        pageLogout:null, 
        employee:isLoggedInNhanvien,
        Chuoi_HTML_contact_us:Chuoi_HTML_contact_us,
        isLoggedIn:req.session.user  
    })
    
}

exports.getFormInputCovidNhanvien=(req,res,next)=>{
    const user= req.user; 
    const DateAndATime=new Date().toLocaleString(); 
    
     res.render('register_covidInfo',{
        message:"",
        role:'nhanvien', 
        pageRegister:true,  
        pageLogin:true,  
        pageLogout:false, 
        user:user,
        datetimeNow:DateAndATime,  
        ContactUs:Chuoi_HTML_contact_us,
        isLoggedIn:req.session.user 
     });

    
}

exports.getSignup=(req,res,next)=>{
    res.render('register',{
        welcome:'staff',
        role:'nhanvien', 
        pageLogin:false, //tránh view báo lỗi 
        pageRegister:true,

      
        bien_moi_truong_Nodejs1:null, 
        bien_moi_truong_Nodejs2:null, 
        errorMessage:null
    })
};

exports.getStaffCheckout=(req,res,next)=>{
    console.log("❤️req.user check out: ",req.user);
    res.render('Phieu_checkout_nhanvien',{
        //title:"trang nhân viên", 
        Working:false, //Chuyển sang trạng thái 'Không làm việc'
        ten_nhan_vien:req.user.Ho_ten, //✅
        nhan_vien:req.user,
        gio_bat_dau_checkout:new Date(),
        //new Date().getHours(),
        
        //dieu_huong.ejs
        role:"nhanvien",
        pageRegister:true, 
        pageLogin:true,  
        pageLogout:false,
        message:null,
        isLoggedIn:req.session.user
    });
}

exports.getDaySummary=(req,res,next)=>{
   
    ModelPhieuCheckOutNhanvien.findOne({
        Ho_ten:req.user.Ho_ten
    }).then(phieucheckout=>{
        if(!phieucheckout){
            console.log("Không tìm thấy phiếu của nhân viên này, vì chuỗi Ho_ten còn whitespace hay phiếu không tồn tại") 
            res.render('TongKetNgayNhanVien',{
                role:"nhanvien",
                pageRegister:true,
                isLoggedIn:req.session.user,
                message:"Không tìm thấy phiếu tổng kết ngày nào",
                mangLuotdiLuotve:[],  
                sophutlamviectrongngay:null
            })
        
        }
        console.log("❤️phieucheckout",phieucheckout); //✔️
        let MangCheckinCheckout=phieucheckout.Danh_sach_cac_luot_batdau_ketthuc;
        //xem index.js và xem hàm reduce() của mảng 
        //https://www.w3schools.com/jsref/jsref_reduce.asp
        console.log("❤️MangCheckinCheckout",MangCheckinCheckout); //✔️
        let giatri_co_tu_reduce_mang = MangCheckinCheckout.reduce(function(accumulator, currentValue) {
          
            let g=accumulator + currentValue.So_phut_phien_lam_viec;
            return g;
        },0);
        console.log("❤️giatri_co_tu_reduce_mang",giatri_co_tu_reduce_mang);//20
      
        res.render('TongKetNgayNhanVien',{
            role:"nhanvien",
            pageRegister:true,
            isLoggedIn:req.session.user,
            message:"Let's summarize your working hours",
            mangLuotdiLuotve:MangCheckinCheckout,
            sophutlamviectrongngay:giatri_co_tu_reduce_mang
        })
    }).catch(err=>console.log(err))

};

exports.getStaffDiemdanh=(req,res,next)=>{
    //console.log("❤️req.user check in: ",req.user);
    const dateNow= Date.now();
    const today = new Date(dateNow); 
    let sang_hay_chieu=(today.getHours() >= 12) ? "PM" : "AM";

    res.render('Phieu_diem_danh_nhan_vien',{
        //title:"trang nhân viên", 
        Working:false, //false thì hiển thị form, true thì hiển thị thông tin
        ten_nhan_vien:req.user.Ho_ten, //✅
       
        ngay_thang_nam_lam_viec:today.toLocaleDateString(),
        gio_bat_dau_lam_viec:today.getHours(),
        phut_bat_dau_lam_viec:today.getMinutes(),
        giay_bat_dau_lam_viec:today.getSeconds(),
        pm_or_am:sang_hay_chieu,  
        role:"nhanvien",
        pageRegister:true, 
        pageLogin:true,  
        pageLogout:false,
        message:null,
        ChuoiHTMLcontactus:Chuoi_HTML_contact_us,
        isLoggedIn:req.session.user 
    });
}

exports.getCovidNhanvienInformation=(req,res,next)=>{
   
    console.log("req.user._id tại getCovidNhanvienInformation",req.user._id);//✅
    ToKhaiCovidNhanvien.findOne({nhanvienId:req.user._id})
        .then(tokhaicovidNV=>{
            if(!tokhaicovidNV){
                //không tìm được user thì re-render 
                return res.status(422).render('login_mobile_w3css',{
                    errorMessage:null,
                    role:'nhanvien',  //cho cả dieu_huong.ejs và  login_mobile_w3css.ejs
                    pageLogin:true,  //cho dieu_huong.ejs
                    pageRegister:false,  //cho dieu_huong.ejs
                    pageLogout:true,
                    contactus:Chuoi_HTML_contact_us,
                    isLoggedIn:req.session.user 
                });
            }
            //có tokhaicovidNV
            return res.render('employeeCovidInfo',{
                tokhai:tokhaicovidNV,
                role:"nhanvien",
                pageRegister:true, 
                pageLogin:true,  
                pageLogout:false,
                message:null,
                hotenNV:req.user.Ho_ten,
                contactus:Chuoi_HTML_contact_us,
                isLoggedIn:req.session.qlcn 
            })

        })
        .catch(err=>{
            console.log(err);
        })
    
}

exports.postPersonalProfile=(req,res,next)=>{
    //nhận file data 
    
    const fileObject = req.file;  //chưa chắc fileObject tồn tại
    const {ID_of_logged_in_employee}=req.body

    console.log("❤️fileObject nhận được là:", fileObject);//ok, multer path là 'public\\userUploadAvatar\\origionalname'
    console.log("❤️ID của nhân viên đang logged in là:", ID_of_logged_in_employee);//ok

    nhanvienMongooseModel.findById(ID_of_logged_in_employee)
                         .then(mongooseModelinstance=>{
                                if(!mongooseModelinstance){
                                    return res.redirect('/');
                                }

                                if(fileObject){
                                    //thậm chí tới index.js thay đổi cách đặt filename thì cũng update được 
                                    mongooseModelinstance.imageMulterPath = fileObject.filename;
                                }

                                return mongooseModelinstance.save().then(result => {   
                                    console.log('UPDATED AVATAR FOR LOGGING IN EMPLOYEE!');
                                    //res.redirect thường nằm trong instance.save()
                                    res.redirect('/nhanvien/view_personal_profile')
                                });
                         })
                         .catch(err=>console.log(err))
}

exports.postStaffDiemdanh=(req,res,next)=>{
    //nhận dữ liệu trong req.body 
    const {ten,noilamviec,datetimeCheckIn}=req.body;
    console.log("❤️postStaffDiemdanh",ten);
    console.log("❤️postStaffDiemdanh",noilamviec);
    console.log("❤️postStaffDiemdanh",datetimeCheckIn);
    

    //phieu diem danh instance 
    const phieu_diem_danh_nhan_vien=new phieuDiemDanhNhanVien({
        //vế trái phải có trong schema 
        Ten_Nhan_vien:ten,
        Noi_Lam_viec: noilamviec,
        Thoi_gian_bat_dau_theo_server:datetimeCheckIn
    })

    //yêu cầu phieu_diem_danh_nhan_vien thực hiện save() với Promise lồng với res.redirect
    phieu_diem_danh_nhan_vien.save()
        .then(result=>{
            console.log("Successfully submit Employee's checkIn form");
            
            const dateNow= Date.now();
            const today = new Date(dateNow); 
            let sang_hay_chieu=(today.getHours() >= 12) ? "PM" : "AM";
            let nguoigui;
            let noilamviec;
            let ngaygiogui;
            

            //sau khi save thì có thể fetch data từ CSDL để xử lý lưu trữ
            phieuDiemDanhNhanVien.findOne({Ten_Nhan_vien:ten})
                .then(user=>{
                    
                    if(!user){
                        //req.flash('error', 'No account with that email found.');
                        return res.redirect('/nhanvien/diemdanhvao');
                    }
                    //nếu có user: 
                    nguoigui=user.Ten_Nhan_vien;
                    noilamviec=user.Noi_Lam_viec;
                    ngaygiogui=user.Thoi_gian_bat_dau_theo_server;       
                    console.log("❤️ Kết quả fetch phiếu điểm danh: ",nguoigui,noilamviec,ngaygiogui);

                    
                    res.render('Phieu_diem_danh_nhan_vien',{
                        Working:true,
                        
                      
                        ngay_thang_nam_lam_viec:null,
                        gio_bat_dau_lam_viec:null,
                        phut_bat_dau_lam_viec:null,
                        giay_bat_dau_lam_viec:null,
                        pm_or_am:null,  
        
                        //gởi dữ liệu từ CSDL cho view
                        MongoDB_datetimestring:ngaygiogui, //✅
                        MongoDB_ten_nhan_vien:nguoigui, //✅
                        MongoDB_noilamviec:noilamviec, //✅
        
                        //dieu_huong.ejs
                        role:"nhanvien",
                        pageRegister:true, 
                        pageLogin:true,  
                        pageLogout:false,
                        message:null,

                        //chuỗi contact
                        ChuoiHTMLcontactusDangLamViec:Chuoi_HTML_contact_us,
                        
                        isLoggedIn:req.session.user 
                    })
                })
                .catch(err=>console.log(err));
        })
        .catch(err=>{
            console.log(err);
        })
}

exports.postLogin=(req,res,next)=>{
    //check session variables: 
    console.log("postLogin:",req.session.user);  
    const {username,password}=req.body;


    const errors=validationResult(req);  //VD password có 3 ký tự thôi

    if(!errors.isEmpty()){
        console.log("⚠️ msg của validation error là: ",errors.array());
        //422= unprocessable entity

        return res.status(422).render('login_mobile_w3css',{
            errorMessage:errors.array()[0].msg,
            role:'nhanvien',  //cho cả dieu_huong.ejs và  login_mobile_w3css.ejs
            pageLogin:true,  //cho dieu_huong.ejs
            pageRegister:false,  //cho dieu_huong.ejs
            pageLogout:true
        });

    }

    console.log("Bắt đầu tìm kiếm nhân viên")
    nhanvienMongooseModel
        .findOne({
            Mat_khau:password,
            Ten_Dang_nhap:username
        })
        .exec()
        .then(user=>{
            console.log("I am here")
            //user có khả năng undefined, nếu viết mật khẩu của admin, trong khi đây đang tìm nhanvien
            
            if(!user){
                console.log("Cannot find a user")
                

                return res.status(422).render('index',{
                    message: 'Invalid password OR username',
                    role:'nhanvien',  //cho cả dieu_huong.ejs và  login_mobile_w3css.ejs
                    
                    //nhóm sau không bắt buộc
                    pageLogin:true,  //cho dieu_huong.ejs
                    pageRegister:false,  //cho dieu_huong.ejs
                    pageLogout:true
                })
             
            }

            console.log("Congrats!, one employee found!")

            //gán biến user cho req.session của MemoryStore trên RAM memory
            req.session.user=user; //💎 Key moment
 
            console.log("Đăng nhập thành công, req.sessionStore hiện tại là: ",req.sessionStore);
            //save (tổng cộng sẽ có 3 session variables là : country, author, user)
            
            req.session.save(err=>{
                console.log(err)
                console.log("Đã lưu thông tin user logged in thành công!");

                res.redirect('/nhanvien/view_personal_profile'); 
            })

            //đừng để log sau save() vì log ngoài save sẽ ra kết quả trước log trong save
            console.log("👉 Save thành công, req.sessionStore hiện tại là: ",req.sessionStore); //chứa 3 session variables là : country, author, user
            console.log("CÂU HỎI LÀ req.session.user này có gọi Mongoose's magic methods được không?");
            console.log("xem controllers >> shop.js trong NJS101x_Lab10.18 yêu cầu req.user thực hiện các Mongoose magic methods, ngoài ra còn chạy các hàm userDefined trong schema req.user.addToCart(product);");
           
        
        }) 
       
        .catch(err => {
               console.log("Err, we detected an error:",err); //ngắn gọn hơn là if(err) vì err không có thì log ra undefined
               res.redirect('/nhanvien/login');  
            }
        )
        
   
}

exports.postThongTinCovidnhanvien=(req,res,next)=>{

    //nhận dữ liệu form post và các validation errors
    const thannhiet=req.body.thannhiet;

    //với checkbox thì đánh vào giá trị nào thì server nhận giá trị đó, do đó sẽ có undefined
    const vaccine1=req.body.vaccine1;
    const vaccine2=req.body.vaccine2;
    const vaccine3=req.body.vaccine3;
    const vaccine4=req.body.vaccine4;

    const nhaSXmui1=req.body.NhaSXvac1;
    const ngayTiemMui1=req.body.vac01_date;

    const nhaSXmui2=req.body.NhaSXvac2;
    const ngayTiemMui2=req.body.vac02_date;

    const nhaSXmui3=req.body.NhaSXvac3;
    const ngayTiemMui3=req.body.vac03_date;

    const nhaSXmui4=req.body.NhaSXvac4;
    const ngayTiemMui4=req.body.vac04_date;

    const Ket_qua_xet_nghiem=req.body.result;

    //nếu có error thì không tạo req mới mà re-render

    //tạo tờ khai covid của nhân viên
    const tokhaicovidnhanvien=new ToKhaiCovidNhanvien({

        //vế trái là key, phải copy từ schema qua
        Than_nhiet:thannhiet,
        
        Vaccine1:vaccine1,
        Vaccine2:vaccine2,
        Vaccine3:vaccine3,
        Vaccine4:vaccine4,

        HangSX_mui_1:nhaSXmui1,
        Ngay_tiem_mui_1:ngayTiemMui1,

        HangSX_mui_2:nhaSXmui2,
        Ngay_tiem_mui_2:ngayTiemMui2,

        HangSX_mui_3:nhaSXmui3,
        Ngay_tiem_mui_3:ngayTiemMui3,

        HangSX_mui_4:nhaSXmui4,
        Ngay_tiem_mui_4:ngayTiemMui4,

        Ket_qua_xet_nghiem:Ket_qua_xet_nghiem,

        //không quên: 
        nhanvienId: req.user   //mongoose sẽ tự lấy id từ trong user
    });
    
    //save(res.redirect('/nhanvien/manHinhNhapCovidNhanvien'));
    tokhaicovidnhanvien.save()
        .then(result=>{
            console.log(`❤️Created tờ khai covid của nhân viên ${req.user.Ho_ten}`);
            res.redirect('/nhanvien/manHinhNhapCovidNhanvien');
        })
        .catch(err=>{
            console.log(err);
        })
}

exports.postLogOut=(req,res,next)=>{
    //how to destroy session inside MemoryStore?
    console.log("postLogout, req.session trong MemoryStore là:",req.sessionStore)
    req.session.destroy(err => {
        console.log(err);
        console.log("req session of Employee has been destroyted ! ")
        res.redirect('/'); //the living room
    });
}

exports.postStaffCheckout=(req,res,next)=>{
    //nhận dữ liệu từ getStaffCheckout và Phieu_checkout_nhanvien
    const {hoten,manhanvien,soHlamtrongngay,noilamviec,luotbatdau,luotketthuc,thoigianphienlamviecTheoPhut,nhanvienId}=req.body;
    console.log("postStaffCheckout",hoten,manhanvien,soHlamtrongngay,noilamviec,luotbatdau,luotketthuc,nhanvienId) //✅
    
    const checkoutDeclaration=new ModelPhieuCheckOutNhanvien({
        //Vế trái phải có trong schema
        Ho_ten:hoten,
        Ma_so_nguoi_checkout: manhanvien,
        //So_gio_da_lam_hom_nay:soHlamtrongngay,
        Danh_sach_cac_luot_batdau_ketthuc:[
            {
                Luot_bat_dau: luotbatdau,
                Luot_ket_thuc:luotketthuc, //Thoi_gian_checkout_nhanvien_ghi
                Noi_lam_viec:noilamviec,
                So_phut_phien_lam_viec:thoigianphienlamviecTheoPhut
            }
        ],
        nhanvienId:nhanvienId
    })

    ModelPhieuCheckOutNhanvien.findOne({nhanvienId:nhanvienId})
                              .then(checkoutpaper=>{
                                   if(!checkoutpaper){
                                        //yêu cầu đối tượng gọi hàm instance method
                                        checkoutDeclaration.save()   
                                                           .then(result=>{
                                                               console.log("❤️Congrats! đã lưu thành công phiếu checkout cho nhân viên");
                                                               res.redirect('/');
                                                           })
                                                           .catch(err=>console.log(err))
                                   }   
                                   console.log('❤️ đã có một tờ checkout cho NV này')//✅
                                   

                                   
                                   checkoutpaper.Danh_sach_cac_luot_batdau_ketthuc.push({
                                        Luot_bat_dau:luotbatdau,
                                        Luot_ket_thuc:luotketthuc,
                                        Noi_lam_viec:noilamviec,
                                        So_phut_phien_lam_viec:thoigianphienlamviecTheoPhut
                                   })


                                      return checkoutpaper.save(result=>{
                                      console.log("❤️đã cập nhật thuộc tính So_gio_da_lam_hom_nay");
                                      res.redirect('/nhanvien/daySummary');
                                     
                                   })

                                  
                              })
                              .catch(err=>console.log(err));

}

exports.postPhieuNghiPhep=(req,res,next)=>{

    const {id_nhanvien,title,annualLeave,date_to_off,hour_to_off,offdays,reason}=req.body;

    console.log("❤️ typeof date_to_off and hour_to_off",Array.isArray(date_to_off)); //false. Qua bên NJS101_Assignment2_phan29 sẽ sửa lỗi này 😎. Đã sửa ✅ 
    console.log("❤️ postPhieuNghiPhep",title,annualLeave,date_to_off,hour_to_off,offdays,reason); 

   
    const phieunghipphepInstance=new ModelPhieuNghiPhep({
        title:title,
        datearray_string:date_to_off,  
        hourarray_string:hour_to_off,
        reason:reason,
        songaynghidangky:offdays, 
        nhanvienId:req.user,
    });

    phieunghipphepInstance.save()
        .then(result=>{
            console.log("save thành công phiếu nghỉ phép");
            
        })
        .then(result=>{
            //lấy annualLeave trừ cho songaynghidangky, sau đó save vào collection nhanviens 
            let annualLeave=req.user.annualLeave-offdays;  //thay vì offdays thì ghi phieunghipphepInstance.songaynghidangky được chứ?
            return nhanvienMongooseModel.findById(id_nhanvien)
                                        .then(nhanvien=>{
                                            if (!nhanvien) {
                                                return res.redirect('/');
                                            }
                                            //save và res.redirect 
                                            nhanvien.annualLeave=annualLeave;  //ReferenceError: cannot access 'annualLeave" before initialization
                                            nhanvien.save(result=>{
                                                console.log("đã cập nhật annualLeave");
                                              
                                                return res.render("phieunghiphep",{
                                                    role:'nhanvien',  
                                                    pageRegister:true,
                                                    isLoggedIn:req.session.user, 
                                                    message:`🎉Bạn ${req.user.Ho_ten} đã nộp phiếu nghỉ phép thành công!🎉 `,  
                                                    nhanvien:req.user,  
                                                    so_h_annualLeave:(req.user.annualLeave*24).toFixed(2) 
                                                })
                                            })
                                        })
                                 
        })
        .catch(err=>console.log(err));
}