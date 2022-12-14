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
     
        pageLogin:true, //??ang ??? trang Login
        pageRegister:false,
        pageLogout:null, 
        isLoggedIn:req.session.admin  
    });  
}

exports.getSignup=(req,res,next)=>{

    //c?? li??n quan g?? trang n??y? https://www.npmjs.com/package/memorystore  (c?? v??? kh??ng c???n thi???t)
    //th??? truy c???p th??ng tin session trong MemoryStore ??? RAM server 
    console.log("T???i admin getSignup, truy c???p req.sessionStore: ",req.sessionStore); //work! c?? ch???a ?????i t?????ng sessions 
    console.log("2 n???i dung ch??nh trong session store MemoryStore l??: ",req.sessionStore.sessions);
    console.log("l??m sao l???y sessionID trong req th?? m???i truy c???p author v?? country trong req.sessionStore.sessions?", req.session);
    console.log("??? H??a ra kh??ng c???n req.sessionStore.sessions v?? c?? th??? truy c???p session data trong req.session");
    console.log("admin country, admin author: ", req.session.country, req.session.author);
    res.render('register',{
        welcome:  `${req.session.author} from ${req.session.country}`  , //welcome:  req.session.author (req.session.country) b??o l???i TypeError: req.session.author is not a function
        role:'admin', 
        pageLogout:true,
        pageLogin:false, //tr??nh view b??o l???i 
        pageRegister:true, 
        bien_moi_truong_Nodejs1:process.env.ADMIN_Ten_Dang_nhap,
        bien_moi_truong_Nodejs2:process.env.ADMIN_Mat_khau,   
        errorMessage:null,
        isLoggedIn:req.session.admin
    })
};

exports.getManageUsers=(req,res,next)=>{
    //t???o 1 row ch???a 2 c???t c?? ng??n c??ch; M???i c???t ch???a form add Employee v?? form add QLCN
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

    //n???u c?? validation error
    if (!expressValidationErrors.isEmpty()) {
        console.log("m???ng t???ng h???p c??c validation userInput validation errors",expressValidationErrors.array());
    
        //???? re-render the previous view
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
    

    //gi??? s??? kh??ng c?? validation errors n??o th?? c??c user input l?? h???p l???
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
            console.log("????ng k?? kh??ng h???p l???. ???? c?? 1 admin");
            

            return res.render('index',{
                        role:'visitor', //c???a dieu_huong.ejs
                       
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
                pageLogin:true, //??ang ??? trang Login
                pageRegister:false,
                isLoggedIn:req.session.admin   
            });  
        }
        console.log("Admin logs in th??nh c??ng");
        //t???o bi???n session cho admin sau ???? l??u v??o session store l?? Memory Store, r???i log xem MemoryStore c?? g?? 
        req.session.admin=user;
        req.session.save(err=>{
            console.log(err);
            console.log("???? l??u th??ng tin c???a admin logged in v??o session trong Memory Store");
            console.log("??????Memory Store sau khi l??u session c???a admin: \n",req.sessionStore);//cookie,country,author,admin:{_id,Ten_dang_nhap,Mat_khau}
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