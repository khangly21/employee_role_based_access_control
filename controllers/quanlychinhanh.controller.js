const mongoose=require('mongoose')

const pdfToKhaiService=require('../services/tokhaipdf.service');
const fs=require("fs");  //không cần install package, đây là Node core
const path=require("path");

const PDFDocument= require('pdfkit');
const doc=new PDFDocument(); 

doc.pipe(fs.createWriteStream('outputEmpCovidInfo.pdf')); 
doc
  .fontSize(25)
  .text('Some text with an embedded font!', 100, 100);
  
  doc.image('imageForPdf.PNG', {
    fit: [250, 300],
    align: 'center',
    valign: 'center'
  });

  // Add another page
doc
.addPage()
.fontSize(25)
.text('Here is some vector graphics...', 100, 100);

// Draw a triangle
doc
.save()
.moveTo(100, 150)
.lineTo(100, 250)
.lineTo(200, 250)
.fill('#FF3300');

// Apply some transforms and render an SVG path with the 'even-odd' fill rule
doc
.scale(0.6)
.translate(470, -380)
.path('M 250,75 L 323,301 131,161 369,161 177,301 z')
.fill('red', 'even-odd')
.restore();

// Add some text with annotations
doc
.addPage()
.fillColor('blue')
.text('Here is a link!', 100, 100)
.underline(100, 100, 160, 27, { color: '#0000FF' })
.link(100, 100, 160, 27, 'http://google.com/');

// Finalize PDF file
doc.end();
//run server để automatically tạo pdf file



//class
const quanlychinhanhMongooseModel=require('../MODELS/QLchinhanh.model');
const nhanvienMongooseModel=require('../MODELS/nhanvien.model');
const tokhaiCovidNhanvienModel=require('../MODELS/nhanvienToKhaiCovid');

//biến toàn cục
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
    res.render('login_qlcn',{
        role:'quanlychinhanh',
        errorMessage:null,
        //dieu_huong.ejs
        pageLogin:true,
        pageRegister:false,
        pageLogout:true,
        
        isLoggedIn:req.session.quanlychinhanh 
    });
};

exports.getSignup=(req,res,next)=>{
    res.render('register',{
        welcome:'branch manager',
        role:'quanlychinhanh',
        pageLogin:false, //tránh view báo lỗi 
        pageRegister:true, 
        bien_moi_truong_Nodejs1:"", 
        bien_moi_truong_Nodejs2:"",
        errorMessage:null
    })
};

exports.getPhieuKiemTraGioLam=(req,res,next)=>{
    res.send('hi')
}

exports.getEmployeeInfo=(req,res,next)=>{
   
    let Ma_so_QLCN= req.session.quanlychinhanh.Chi_nhanh.Ma_so
    console.log(`Quản lý của ${Ma_so_QLCN} đang cần tìm thông tin covid các nhân viên cấp dưới của mình`)

    //After having a model, we can use method find() on the model of a particular collection to get documents of the collection.
    let yeutocantim='Chi_nhanh.Ma_so'; 

    //https://specify.io/how-tos/find-documents-in-mongodb-using-the-mongo-shell
    quanlychinhanhMongooseModel.find({"Chi_nhanh.Ma_so":Ma_so_QLCN})  //nếu ghi find({yeutocantim:Ma_so_QLCN}) có vẻ tương tự nhưng sẽ ra cả document chứa CN_1 và CN_2
                               .then(data=>{
                                    console.log("chi nhánh CN_1 có các quản lý chi nhánh:");
                                    console.log(data);  //✅
                               })
                               .catch(err=>console.log(err))

    nhanvienMongooseModel.find({"Don_vi.Chi_nhanh.Ma_so":Ma_so_QLCN})
                         .then(employees=>{
                            console.log(`các đối tượng nhân viên dưới quyền của ${Ma_so_QLCN}`);
                            console.log(JSON.stringify(employees,undefined,4));  //✅

                       
                            res.render("qlcn_employeeCovid",{  
                                role:'quanlychinhanh',
                                isLoggedIn:req.session.quanlychinhanh,
                                pageRegister:true,
                                pageLogin:true,
                                message:'',
                                employees:employees
                                
                            })
                         })
                         
                                                   
                                                    
                         .catch(err=>console.log(err))
    
}

exports.getCovidNhanvienCuThe=(req,res,next)=>{
    //nhận ID của nhân viên là param trên endpoint URL (phân biệt là query phải sau dấu hỏi)
    const employeeId = req.params.nhanvienMongoId;
 
    tokhaiCovidNhanvienModel.findOne({
        nhanvienId: employeeId
    })
    .populate('nhanvienId')
    .then(tokhaiembednhanvien=>{
        if(!tokhaiembednhanvien){
            console.log("tokhaiembednhanvien is null. Không tồn tại tờ khai y tế của nhân viên trên")
        }
        console.log(`❤️ Tờ khai covid cá nhân của nhân viên ${employeeId} đã được tìm thấy`);
        console.log("tokhaiembednhanvien",tokhaiembednhanvien);
        res.render('chitietCovidCanhan',{
            role:'quanlychinhanh',
            isLoggedIn:req.session.quanlychinhanh,
            pageRegister:true,
            pageLogin:true,
            message:"",
            tokhaiembednhanvien:tokhaiembednhanvien
        })
    })
    .catch(err=>console.log(err));
}

exports.getCovidQuanly=(req,res,next)=>{
    res.render('qlcnCovidInfo',{
        //tokhai:tokhaicovidNV,
        role:"quanlychinhanh",
        pageRegister:true, 
        pageLogin:true,  
        pageLogout:false,
        message:"Thông tin covid cá nhân quản lý chi nhánh",
     
        contactus:Chuoi_HTML_contact_us,
        isLoggedIn:req.session.quanlychinhanh  
    })
}

exports.getToKhaiCovidcuaNhanvienNay=(req,res,next)=>{
    
    const tokhaiCovidID=req.params.tokhaiembednhanvienId;
    console.log("Id của tờ khai covid muốn xuất pdf: \n",tokhaiCovidID);

 
    tokhaiCovidNhanvienModel.findById(tokhaiCovidID)  //dùng findById(tokhaiCovidID) cũng undefined to_khai
                            .populate('nhanvienId')   //để controller có thể gửi Tên nhân viên tới tokhaipdf.service.js
                            .then(tokhai=>{
                                console.log("Id của tờ khai sau khi findById: \n",tokhai._id); //ok!
                                if(!tokhai){
                                    return next(new Error('No covid declaration found!'));
                                }

                                const fileName="covidDeclaration-" + tokhaiCovidID+".pdf";
                                const filePath=path.join('pdf','TokhaiCovidNhanvien',fileName);

                               
                                const stream=res.writeHeader(200,{
                                    'Content-Type': 'application/pdf; charset=utf-8',
                                   
                                    'Content-Disposition': 'attachment;filename="' + fileName +'"'
                                });//ok, it's all fine status

                                var someEncodedString = Buffer.from(tokhai.nhanvienId.Ho_ten, 'utf8').toString();
                                console.log("someEncodedString",someEncodedString) //nice! Thái thế hiền Thục
                                pdfToKhaiService.buildPDFchoTokhai(
                                    
                                    (chunk)=>stream.write(chunk),
                                    ()=>stream.end(),
                                    
                                    {
                                        Ten_nhan_vien_thuc_hien_to_khai:someEncodedString,
                                        Ma_nhan_vien:tokhai.nhanvienId.Ma_so,
                                        Than_nhiet:tokhai.Than_nhiet,

                                        HangSX_mui_1:tokhai.HangSX_mui_1,
                                        NgaySX_mui_1:tokhai.Ngay_tiem_mui_1,

                                        HangSX_mui_2:tokhai.HangSX_mui_2,
                                        NgaySX_mui_2:tokhai.Ngay_tiem_mui_2,

                                        HangSX_mui_3:tokhai.HangSX_mui_3,
                                        NgaySX_mui_3:tokhai.Ngay_tiem_mui_3,

                                        HangSX_mui_4:tokhai.HangSX_mui_4,
                                        NgaySX_mui_4:tokhai.Ngay_tiem_mui_4,

                                        KETQUAXETNGHIEM:tokhai.Ket_qua_xet_nghiem
                                

                                    }
                                );

                            })
                            .catch(err=>{
                                console.log(err);
                            })
                            
}

exports.postLogin=(req,res,next)=>{
    const {username,password}=req.body;
    console.log("❤️postLogin của qlcn: ",username,password); //ok
    quanlychinhanhMongooseModel.findOne({Ten_Dang_nhap:username,Mat_khau:password})
        .then(qlcn=>{
            if(!qlcn){
                return res.status(422).render('login_qlcn',{
                    role:'quanlychinhanh',   
                    errorMessage:"Logging in failed, please try again",
                    pageLogin:true,
                    pageRegister:false,
                    isLoggedIn:req.session.quanlychinhanh   
                });          
            }
            console.log("QLCN logs in successfully");
            //tạo biến session cho admin sau đó lưu vào session store là Memory Store, rồi log xem MemoryStore có gì 
            req.session.quanlychinhanh=qlcn;
            req.session.save(err=>{
                console.log(err);
                console.log("❤️đã lưu thông tin của QLCN logged in vào session trong Memory Store");
                console.log("❤️Memory Store sau khi lưu session của QLCN: \n",req.sessionStore);
                res.render('index',{
                    
                    message:`Branch manager ${username} has been logged in successfully`,  
                    role:'quanlychinhanh',  
                    isLoggedIn:req.session.quanlychinhanh,          
                    pageLogin:true,
                    pageRegister:false
                })
            })
        })
        .catch(err=>{
            console.log(err);
        })
}

exports.postLogOut=(req,res,next)=>{
 
    req.session.destroy(err => {
        console.log("req session of Branch Manager has been destroyted ! ")
        res.redirect('/quanlychinhanh/login'); //the living room
    });
}