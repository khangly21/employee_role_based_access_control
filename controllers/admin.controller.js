const { body, validationResult } = require('express-validator');

const adminMongooseModel=require('../MODELS/admin.model');

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

const Chuoi_HTML_add_employee_into_database=`
    <form style="padding:2rem">
        <legend class="w3-text-blue">ADD USER TO DATABASE</legend>
        <div class="mb-3">
          <label for="exampleInputEmail1" class="form-label">Email address</label>
          <input type="email" class="form-control w3-text-pink" id="exampleInputEmail1" aria-describedby="emailHelp" value="Your mail">
          <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
        </div>

        <div class="mb-3">
          <label for="exampleInputPassword1" class="form-label">Password</label>
          <input type="password" class="form-control w3-text-pink" id="exampleInputPassword1" value="Your password">
        </div>

        <div class="mb-3 form-check">
          <input type="checkbox" class="form-check-input" id="exampleCheck1">
          <label class="form-check-label" for="exampleCheck1">Check me out</label>
        </div>
    <button type="submit" class="btn btn-primary">Submit</button>
</form>
`

const Chuoi_HTML_add_QLCN_into_database=`
        <form style="padding:2rem">
        <legend class="w3-text-blue">ADD USER TO DATABASE</legend>
        <div class="mb-3">
          <label for="exampleInputEmail1" class="form-label">Email address</label>
          <input type="email" class="form-control w3-text-pink" id="exampleInputEmail1" aria-describedby="emailHelp" value="Your mail">
          <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
        </div>
        
        <div class="mb-3">
          <label for="exampleInputPassword1" class="form-label">Password</label>
          <input type="password" class="form-control w3-text-pink" id="exampleInputPassword1" value="Your password">
        </div>
        
        <div class="mb-3 form-check">
          <input type="checkbox" class="form-check-input" id="exampleCheck1">
          <label class="form-check-label" for="exampleCheck1">Check me out</label>
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
        </form>
`


exports.getLogin=(req,res,next)=>{
    res.render('login_mobile_bootstrap5',{
       
        role:'admin',   
        errorMessage:"",
     
        pageLogin:true, //đang ở trang Login
        pageRegister:false,
        pageLogout:null, 
        isLoggedIn:req.session.admin  
    });  
}

exports.getSignup=(req,res,next)=>{

    //có liên quan gì trang này? https://www.npmjs.com/package/memorystore  (có vẻ không cần thiết)
    //thử truy cập thông tin session trong MemoryStore ở RAM server 
    console.log("Tại admin getSignup, truy cập req.sessionStore: ",req.sessionStore); //work! có chứa đối tượng sessions 
    console.log("2 nội dung chính trong session store MemoryStore là: ",req.sessionStore.sessions);
    console.log("làm sao lấy sessionID trong req thì mới truy cập author và country trong req.sessionStore.sessions?", req.session);
    console.log("✅ Hóa ra không cần req.sessionStore.sessions vì có thể truy cập session data trong req.session");
    console.log("admin country, admin author: ", req.session.country, req.session.author);
    res.render('register',{
        welcome:  `${req.session.author} from ${req.session.country}`  , //welcome:  req.session.author (req.session.country) báo lỗi TypeError: req.session.author is not a function
        role:'admin', 
        pageLogout:true,
        pageLogin:false, //tránh view báo lỗi 
        pageRegister:true, 
        bien_moi_truong_Nodejs1:process.env.ADMIN_Ten_Dang_nhap,
        bien_moi_truong_Nodejs2:process.env.ADMIN_Mat_khau,   
        errorMessage:null,
        isLoggedIn:req.session.admin
    })
};

exports.getManageUsers=(req,res,next)=>{
    //tạo 1 row chứa 2 cột có ngăn cách; Mỗi cột chứa form add Employee và form add QLCN
    res.render("adminManageUsers",{
        role:"admin",
        pageRegister:true,
        pageLogin:true,
        pageLogout:false,
        HTMLobject:Chuoi_HTML_contact_us,
        isLoggedIn:req.session.admin,
        Chuoi_HTML_add_employee_into_database:Chuoi_HTML_add_employee_into_database,
        Chuoi_HTML_add_QLCN_into_database:Chuoi_HTML_add_QLCN_into_database
    })
}

exports.postSignup=(req,res,next)=>{
    console.log("admin postSignup here, begin to process user input on server");
    
    const expressValidationErrors=validationResult(req);

    //nếu có validation error
    if (!expressValidationErrors.isEmpty()) {
        console.log("mảng tổng hợp các validation userInput validation errors",expressValidationErrors.array());
    
        //🍽 re-render the previous view
        return res.status(422).render('register', {
          //path: '/register',
          //pageTitle: 'Signup',
          errorMessage: expressValidationErrors.array()[0].msg, 
         
          welcome:  `${req.session.author} from ${req.session.country}`, 
          role:'admin', 
          pageLogin:false,
          pageRegister:true, 
          bien_moi_truong_Nodejs1:null,
          bien_moi_truong_Nodejs2:null,
          isLoggedIn:req.session.admin
        });
      }
    

    //giả sử không có validation errors nào thì các user input là hợp lệ
    const {username,password,confirmingPassword}=req.body;
    console.log("Admin's username,password,confirmingPassword:",username,password,confirmingPassword); //fine! 
    
    const admin=new adminMongooseModel({
        Ten_dang_nhap:username,
        Mat_khau:password
    });
    adminMongooseModel.findOne({},function(err,doc){ 
        if(err){
            console.log(err);
        }
        if(doc){
            console.log("Đăng ký không hợp lệ. Đã có 1 admin");
            

            return res.render('index',{
                        role:'visitor', //của dieu_huong.ejs
                       
                        message:'Comeon! There is no more one admin!',
                        isLoggedIn:req.session.admin
                    }
            )
                
        } 
        admin.save()
            .then(result=>{
                console.log("Successfully Admin Registration");
                res.redirect('/admin/login');
            })
            .catch(err=>{
                console.log("OH, I HAVE CAUGHT AN ERROR: \n",err); 
            })
              })
          
             
    
}

exports.postLogin=(req,res,next)=>{
   
    const {username,password}=req.body;

    adminMongooseModel.findOne({
        Ten_dang_nhap:username,
        Mat_khau:password
    }).then(user=>{
        if(!user){
            return res.status(422).render('login_mobile_bootstrap5',{
                role:'admin',   
                errorMessage:"Logging in failed, please try again",
                pageLogin:true, //đang ở trang Login
                pageRegister:false,
                isLoggedIn:req.session.admin   
            });  
        }
        console.log("Admin logs in thành công");
        //tạo biến session cho admin sau đó lưu vào session store là Memory Store, rồi log xem MemoryStore có gì 
        req.session.admin=user;
        req.session.save(err=>{
            console.log(err);
            console.log("đã lưu thông tin của admin logged in vào session trong Memory Store");
            console.log("❤️Memory Store sau khi lưu session của admin: \n",req.sessionStore);//cookie,country,author,admin:{_id,Ten_dang_nhap,Mat_khau}
            res.redirect('/admin/manageUsers');
        })
    }).catch(err=>console.log(err));
    
}

exports.postLogOut=(req,res,next)=>{
    
    req.session.destroy(err => {
        console.log("req session of Admin has been destroyted ! ")
        res.redirect('/admin/login'); //the living room
    });
}