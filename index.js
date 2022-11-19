// Nodejs Global Objects accessible for all modules: 'path','process', no installation
const path = require('path');


//tạo bảng rỗng trên MongoDB ( thực ra là chạy mongoose.model()  ), sau đó lên MongoDB manually nhập dữ liệu
const nhanvienMongooseModel = require('./MODELS/nhanvien.model');
const quanlychinhanhMongooseModel = require('./MODELS/QLchinhanh.model'); //đọc schema và tạo collection rỗng tên dựa vào tên model

//nhận đối tượng Mongoose model (lúc review lab thì mentor nguyendinhnhat noi model để tương tác với CSDL)
//https://www.geeksforgeeks.org/mongoose-countdocuments-function/

//tạo collection
const CongTy = require('./MODELS/congty.model');
const TokhaiCovidCanhanNhanvien=require('./MODELS/nhanvienToKhaiCovid'); //mặc dù không sử dụng biến TokhaiCovidCanhanNhanvien, nhưng vẫn chạy hàm mongoose.model() giúp tạo collection tên "nhanvientokhaicovids" trên mongodb
const tokhaiDiemDanh=require('./MODELS/recordedDiemDanh.model');//✅
const tokhaiKetThucLam=require('./MODELS/recordedKetThucLam.model') 

//core Express with core functionalities: https://expressjs.com/en/5x/api.html#app.locals
const express = require('express');

//const helmet = require('helmet');
const session = require('express-session');
const cookieParser = require('cookie-parser');

//nhập khẩu các middleware bổ sung cho Express core functionalities
require('dotenv').config(); //Now, we can access any environment variable using process.env.[ENV_VARIABLE_NAME] với tên biến môi trường viết hoa


const multer = require('multer'); //hỗ trợ POST mixed data (text and file)

const mongoose = require('mongoose');
mongoose.set('debug', true); //Mongoose's change tracking sends a minimal update to MongoDB based on the changes you made to the document. You can set Mongoose's debug mode to see the operations Mongoose sends to MongoDB.

//nhận hàm taoCSDLvaFirstCollection
//const taoCSDLvaFirstCollection = require('./DATABASE/MongoDB'); //nếu const taoCSDLvaFirstCollection=require('./Database/MongoDB').connectionFactory; sau đó gọi taoCSDLvaFirstCollection() thì 🔔 is not a function

var mongodbURL='mongodb+srv://lyvietkhang_admin:FLC0EfhTqJHonvsI@khangserver0.w0azxjp.mongodb.net/NHANVIENQUANLY?';
mongoose.connect(mongodbURL);
//https://www.geeksforgeeks.org/nodejs-connect-mongodb-node-app-using-mongoosejs/
mongoose.Promise=global.Promise;
//get connection
var db=mongoose.connection;
db.on('connected',function(){
  console.log('Mongoose default connection done');
})
db.on('error',function(err){
  console.log('Mongoose default connection error'+err);
})

const errorController = require('./controllers/error.controller');

//create Express instance
/// 💎 Express is a module framework for Node that you can use for applications.
const app = express();
//app.use(helmet());
///Snyk security recommendation: Consider using csurf middleware for your Express app to protect against CSRF attacks (không phải csurf attacks)
//// 💡 https://www.geeksforgeeks.org/implementing-csurf-middleware-in-node-js/
/// helmet to disable the X-Powered-by header in res header 
/// 💡 https://www.geeksforgeeks.org/node-js-securing-apps-with-helmet-js/    


app.disable('x-powered-by'); //đây là solution để giấu X-Powered-by Express

//multer.storageEngine and File Validation on server 
//diskStorage sẽ lưu file data trong file trên server, chứ không lưu tạm memoryStorage() sẽ mất hình ảnh của user upload nếu tắt máy tính
const fileStorage=multer.diskStorage({
  //kiểm soát đích đến của file data
  destination:(req,file,cb)=>{ //khi nhận đủ req,file và cb thì sẽ kích hoạt hàm cb
    cb(null, './public/userUploadAvatar'); //tương đối giữa index.js và public 
    //Nếu chọn nơi lưu uploaded file là images thì cb(null, './images')  thì để phối hợp multer req.file.path có "/images/x"  và express.static URL "/x" thì cần có app.use('/images',express.static(path.join(__dirname, 'images'))); 
      // ✅ TRAP: images folder là có sẵn manually, thì mới không bị báo lỗi là không tìm thấy đường dẫn
      // ✅ TRAP: Nếu không tạo sẵn thư mục images thì Error: ENOENT: no such file or directory, open 'D:\images\image-22-8-2022-install_React.PNG' 
  },
  
  //kiểm soát tên file lưu incoming file data
  filename:(req,file,cb)=>{
    //fieldname của input là 'empAvatar'
    //do mặc định của multer là ghi dữ liệu file vào 1 file không có extension, do đó originalname sẽ đảm bảo tên file có extension giống type của file incoming
    //cb(null, file.fieldname + '-' + new Date().getDate() + '-' + (new Date().getMonth()+1) + '-' +new Date().getFullYear() + '-' + Math.round(Math.random() * 1E9) + '-' + file.originalname); //✅Super OK. cứ console.log(file) để xem thêm
    cb(null, file.fieldname +file.originalname);
  }
});
//filter for file adoption. Validation này ở client input có accept attribute, tuy nhiên Tip là nên validate file ở trên server
const fileFilter=(req,file,cb)=>{
  if(file.mimetype==='image/png' ||    //chú ý: PNG thì sao? 
     file.mimetype==='image/jpg' || 
     file.mimetype==='image/jpeg'
  ){
      //no error and I wanna store that file
      cb(null,true);
  }else{
      //no error but I don't wanna store that file, I don't accept it
      cb(null,false); 
  }
};

//parser that look for multipart/form-data, giúp gửi file bằng POST req
app.use(multer({storage:fileStorage,fileFilter:fileFilter}).single('empAvatar'));
//create "parsing middlewares" then register/load to app
app.use(express.urlencoded({
  extended: false
})); //parse url-encoded POSTreq form input TEXT data (fname=John&lname=Doe) into JS object req.body {fname:'John',lname:'Doe'}. Cơ bản req.body is undefined because it is not a global variable 
app.use(express.json()); //https://www.tutorialspoint.com/express-js-express-json-function , Content-type header: 'application/json' 
//sẽ dùng middleware express.json() khi response một pdf file cho client on the fly (as soon as express handler receices pdf chunks, không buffer chunks trong memory)

/*app.use(multer());*/ //MIX data (text+file), Content-type header:'multipart/form-data'


//Security against CSRF attackers


//Set static folders (ngoài public thì thêm các folder khác như images) (static = files do not contain any dynamic server-side information; dynamic = example ejs files);Nơi đây sẽ hợp tác multer:  destination: './public/uploads/images'
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public',express.static(path.join(__dirname, 'public'))); //phục vụ lấy imageMulterPath có prefix là public/  👉 vì nó giúp img src của có public/ 👉 không có dòng này thì sẽ disable <img style="width:28rem;padding-top:2rem" src="\..\..\public\userUploadAvatar\r.png" alt="r absolute/relative path" > trong nhanvienProfile


//👉 Mục đích của middleware này là giúp xem req.sessionStore   (nếu không dùng middleware thì ReferenceError: req is not defined)
app.use((req, res, next) => {
  //console.log("req trước khi session: \n",req); 
  console.log("WELCOME brand new request object, dĩ nhiên là không có req.session vì req cũ đã bị hủy");
  console.log("HTTP is stateless (sau một cuộc giao tiếp giữa client và server thì server không lưu bất cứ thông tin gì về client, nên lần liên hệ kế tiếp từ client, server xem như hoàn toàn client mới/ Đây là kiểu CRM quá tệ!); in order to associate a request to any other request, you need a way to store user data between HTTP requests");
  console.log("cookie là gì và tác dụng của nó có bổ sung cho điểm yếu của HTTP is stateless thế nào");
  console.log("ngoài cookie, có thể lưu thông tin trong localStorage của browser rồi dùng $.ajax hay form POST/GET để gửi trong từng req khác nhau");
  console.log("cả 2 cách trên đều lưu thông tin trong browser, dễ bị đọc và thay đổi bởi người dùng");
  console.log("vd cookie-session lưu toàn bộ thông tin session trong phạm vi cookie và để ở trình duyệt. Thích hợp khi không có database, hay trong lúc clusters phân tán");
  console.log(" Sessions solve exactly this problem.");
  console.log("express session mặc định lưu trong MemoryStore , lưu trong RAM memory, https://premioinc.com/blogs/blog/what-you-need-to-know-about-server-memory")
  console.log("Session là gì? Không phải là 1 vùng nhớ trên server. You assign the client (desktop, mobile, tablet) an ID and it makes all further requests using that ID. Information associated with the client is stored on the server linked to this ID");


  console.log("trước khi req đi qua session() middeware, thì req.sessionStore có chứa gì? :", req.sessionStore); //💎undefined
  if (req.session) {
    console.log("* req được gán session");
    return next();
  } else {
    console.log("** req không có session"); // 👈Dĩ nhiên , phải đặt middleware này AFTER the session middleware
    return next();
  }
})

//Each session has a unique cookie object accompany it. 
//Session data is not saved in the cookie itself, howeve cookies are used, so we must use the cookieParser() middleware before session().
//Do cookie được sử dụng nên cookieParser() phải đứng trước session()
/// req.session.cookie.expires = new Date(Date.now() + hour);
/// req.session.cookie.maxAge = hour;
app.use(cookieParser());

//load or create session for incoming req
//when a user visits the site, it creates a new session for the user and assigns a cookie on browser
//https://stackoverflow.com/questions/26531143/sessions-wont-save-in-node-js-without-req-session-save
app.use(session({
  secret: 'the secret',
  resave: false,
  saveUninitialized: false,
  expires: false,
  maxAge: null

  /* By default cookie.maxAge is null, meaning no "expires" parameter is set
   so the cookie becomes a browser-session cookie. When the user closes the
   browser the cookie (and session) will be removed. */
  /*
     **** ❤️ Thí nghiệm 05: dựa trên cookie maxAge là null 
               ****** case1: đóng tab broser, mở tab khác 👉  cookie không đổi
               ****** case2: đóng trình duyệt,mở lại     👉   cookie cũ bị xóa, cookie mới được gán vào
  */
  //session store là gì? https://expressjs.com/en/resources/middleware/session.html
  ///không nói gì thì mặc định lấy Express session store là MemoryStore
}));


//👉 Thí nghiệm 01: Mục đích của middleware này là tiếp cận req để check xem MemoryStore req.sessionStore và req.session 👉 Kết quả thí nghiệm 01: http://localhost:3002/ thấy không có cookie nào trên browser khi có req đầu tiên (vì session is not initialized yet), dĩ nhiên req.cookies cũng {}
console.log("❤️ THÍ NGHIỆM 01")

app.use((req, res, next) => {
  //debug
  if (req.session) {

    console.log("sau khi middleware session() được kích hoạt, req.session được hình thành và req.sessionStore mới được tạo ra: ", req.sessionStore); //💎//👈 hiện req.sessionStore đang chứa sessions là đối tượng rỗng 😼
    console.log("*** req được gán session, mặc định là: ");
    console.log("req.session với default cookie data: \n", req.session); //ok Session { cookie:{  } }, chỉ chứa 1 đối tượng duy nhất là cookie với các giá trị mặc định (được lý thuyết xem như uninitialized session 😒), đây là nền tảng cho gán các biến khác như req.session.country vào (lúc này là initialized session 😃). Trong khi req.sessionStore là MemoryStore đang chứa biến đối tượng sessions rỗng {} sau khi req qua session()
    console.log("req cookies and signedCookie and req.session.cookie  : \n", req.cookies, "  ", req.signedCookies, " ", req.session.cookie); //undefined undefined

    console.log("req.sessionID mới ứng với req mới này: ", req.sessionID); //brand-new req qua session() thì có sessionID x, khác với req tới /admin/login? có sessionID y 😇

    console.log("Phân tích anh saveUninitialized: false này dùng cho database hay memory ??")

    return next();
  } else {
    console.log("req không có session");
    return next();
  }
})


//👉 Thí nghiệm 02: hiện tại session is uninitialized, MIDDLEWARE này có mục đích khởi tạo session (bằng cách gán biến cho req.session ) và xem tác dụng của session.cookie.maxAge=null xem đóng browser thì cookie và session đều bị hủy 
//👉 Kết quả thí nghiệm 02: với việc tạo 2 biến session, thì session được initialized, res quăng 1 cookie tới browser là connect.sid ; Tất nhiên req đầu tiên req.cookies là {} vì req gửi trước khi cookie được response cho browser
/*
   By default cookie.maxAge is null, meaning no "expires" parameter is set
   so the cookie becomes a browser-session cookie. When the user closes the
   browser the cookie (and session) will be removed.
*/
console.log("❤️ THÍ NGHIỆM 02")
app.use((req, res, next) => {
  // if (!req.session) { //Bị dư, vì req qua session() thì tất nhiên có session
  //   next(); //đã logout thì session.destroy, nhưng qua app.use(session({ thì có lại uninitialized session chứa đối tượng cookie thôi
  // }
  console.log("Trạng thái ban đầu của session store là 1. MemoryStore trên RAM memory cùng với 2. UNITIALIZED session trong nó ,3. cookie trên browser: ", req.sessionStore, "\n", req.sessionStore.sessions, "\n", req.cookies);
  //Kết quả: sessionStore chứa đối tượng rỗng sessions; req.cookie cũng rỗng

  //khi req mang session chảy qua middleware này thì sẽ khởi tạo và lưu 2 session variables sau:
  //Đối với saveUninitialized: false, không có set session variables (ngoài cookie có sẵn) thì https://stackoverflow.com/questions/68841518/storing-sessions-with-express-session-connect-mongo-and-mongoose  có vẻ dành cho entry/record on session collection trên databases

  //Với mọi req khác nhau, thì vẫn gửi lên server cùng cookies (là req.cookies) và cùng lưu 2 biến sessions sau: Đây là mục đích kết nối các req khác nhau của cùng một người cho tới khi restart server (hay mất điện thì session X trên RAM MemoryStore biến mất. KHi đó cũng người này mà gửi req lên với cookie chứa sessionID của X thì server không biết người khách cũ do HTTP stateless, nên sẽ tạo session mới và gửi lại cookie mới cho người này)
  req.session.country = 'VietNam'; //"Made with love from Vietnam"
  req.session.author = 'LyVietKhang';

  //official establish session (the INITIALIZED session), ok! my browser gets a cookie storing sessionID
  console.log("session is not established/initialized , therefore there is no cookie containing sessionID on browser! You should set some session variable here to legitimate session saving!");
  req.session.save(err => { //Nodejs đơn luồng hay đa luồng? ở đây bắt async save hoạt động như sync (phải save xong mới được gọi callback)
    if (err) {
      console.log("Có vấn đề với session saving!: ", err);
    }

    console.log("session được save trong session store là MemoryStore, có cookie maxAge được cố ý gán null lúc kích hoạt middleware session(): ", req.sessionStore);
    console.log("req.cookies là: ", req.cookies); //nếu browser chưa có connect.sid cookie thì chỗ này undefined với req đầu tiên. Khi lần đầu req (VD tới '/') truy cập server thì ngay lập tức browser nhận cookie chứa sessionId, req thứ 2 (VD tới '/login') thì req.cookies mang mã connect.sid
    console.log("vậy req mới này có truy cập req.session.user được không? ")

    return next(); 
  });

})

//👉 Thí nghiệm 03: mục đích middleware này là để check xem có tồn tại req.session.user không ở chỗ này.
    ///tổng quát là có req.session.user ở postLogin thành công, vậy tất cả req mới về sau ở app.js có nhận được req.session.user không?
//🌴 Kết quả thí nghiệm 03
    /// Dĩ nhiên session đã được initialized
    /// Kinh nghiệm: Đối với Model.save(cb(console.log())) thì console.log bên ngoài sẽ chạy trước console.log trong save, và res.render nên cho vào trong cb của hàm save()
    /// Khi req tới http://localhost:3002/ thì "Không tồn tại req.session.user trong MemoryStore"
    /// req chảy tới http://localhost:3002/nhanvien/login? thì "Không tồn tại req.session.user trong MemoryStore"; "tại getlogin, req.session.user là:" là undefined
    /// Đăng nhập thành công NV_1 thì req bị redirect tới http://localhost:3002/nhanvien/login  ?? SAI, vì không có redirect nào mà chỉ xử lý hiển thị view thôi
    /// 💢 Problem Tạm thời: Không có câu trả lời cho thí nghiệm 03 vì Không redirect để req mới chạy sau khi tạo rồi lưu req.session.user trong MemoryStore mà chỉ xử lý hiển thị res.rendering view 'nhanvienProfile' thôi, do đó không nhận được kết quả của Thí nghiệm 03
    /// 💢 Ngoài ra, lý do khác không có câu trả lời cho TN03 là middleware không có next() nên bất cứ req nào cũng bị pending trong Network 
    /// 💊 Solution: res.redirect('/nhanvien/login');
    /// 🥬 Kết luận: bất cứ req mới nào cũng truy xuất được req.session.user 

console.log("❤️ THÍ NGHIỆM 03");

app.use((req,res,next)=>{
    if(!req.session.user){
        console.log("❤️ TH3: Không tồn tại req.session.user trong MemoryStore");
        return next();
    }

    console.log("❤️Thí nghiệm 03 req.session.user trong MemoryStore", req.sessionStore, req.session.user);
    
    next();
})


//👉  Thí nghiệm 04: Vai trò của nút Logout
    /// thử login thành công, sau đó logout 
app.use((req,res,next)=>{
  if(!req.session.user){
      console.log("❤️ TH4: Không tồn tại req.session.user trong MemoryStore");
      console.log("TH4:Hình dạng của session store MemoryStore:",req.sessionStore);//sessions chứa cookie MaxAge null, country, author
      return next();
}

  console.log("❤️Thí nghiệm 04 req.session.user trong MemoryStore", req.sessionStore, req.session.user);  
  next(); //coi chừng system error. Thiếu là mọi req sẽ bị pending, và trình duyệt spinning
})


//do req.session.user không có các hàm Mongoose để đọc/ghi dữ liệu, nên phải tạo ra req.user với user là Mongoose model dynamically based on who/client is logging in 
app.use((req,res,next)=>{
  if(!req.session.user){
      return next();
  }

  req.congty=CongTy.Ten;//undefined

  console.log("❤️Công ty lưu trong req:",req.congty ); //Note:MUỐN DÒNG NÀY HIỆN RA THÌ PHẢI NHANVIEN login thành công

  nhanvienMongooseModel.findById(req.session.user._id)
                           .then(user=>{
                              if(!user){//accessing attribute _id on a null/undefined value
                                  return next();
                              }
                              //tới đây req mới tạo bởi clicking "Login" bị pending
                              req.user = user;//👈 req.user chỉ được tạo thành khi đã loggedin

                              console.log("❤️THÍ NGHIỆM 06:");
                              console.log("req.user có dữ liệu là: ",req.user); //✔️
                              //https://mongoosejs.com/docs/guide.html#methods
                              console.log("Chủ yếu req.user để truy cập các hàm tự định nghĩa trên model instance (aka mongoose instance methods):",req.user._id.toString()); //✔️
                              //console.log("Hàm tự định nghĩa cho mongoose model instance:",req.user.findSimilarGender()); //❓
                              console.log("tìm model name của một instance:",req.user.constructor.modelName) //✔️ NHANVIEN 👉  https://stackoverflow.com/questions/47040333/is-there-a-way-to-get-the-model-name-from-a-mongoose-model-instance
                              console.log("tìm thông tin ngoại ngữ theo mã ngoại ngữ:",JSON.stringify(req.user.findForeignLanguageByMaNgoaiNguVoiSearchWords('ba lan')));
                              console.log("tìm thông tin ngoại ngữ theo mã ngoại ngữ:",JSON.stringify(req.user.findForeignLanguageByMaNgoaiNguVoiSearchWords('y')));
                              next(); //giải pháp cho req bị pending
                           })
                           .catch(err=>{
                              throw new Error(err);
                           })
})

// 📡 View Engine Setup
/// ✍️ Embedded javaScript (EJS) lets you generate HTML markup with plain JavaScript.
app.set('views', path.join(__dirname, 'views')) //Nếu chưa tạo phieunghiphep.ejs thì Error: Failed to lookup view "phieunghiphep" in views directory "D:\KHOA_5_BACKEND1\Đồ án, Exercises, Labs, Final\ASSIGNMENT2\NJS101_Assignment2_phan28\views"
app.set('view engine', 'ejs')

//Dynamic (based on provider environment) Port Setup
//app.set('port', process.env.PORT || 3005);  //dạng app.set(name,value) thì phải có app.get(name)
//app.set('port', process.env.PORT || 3002); //port 3002 và port 3005 bị blocked vì sử dụng helmet với TLS protection  ⚠️ https://superuser.com/questions/1530763/how-to-block-a-port-on-localhost
//http://localhost:3002/admin/login vẫn vào được và dropdown vẫn mở ok


//😀routes
const visitorRoutes = require('./routes/visitor.route');
const adminRoutes = require('./routes/admin.route')
const nhanvienRoutes = require('./routes/nhanvien.route');
const quanlychinhanhRoutes = require('./routes/quanlychinhanh.route');
const pdfRouter=require('./routes/pdf.route');

//const authenticationRoutes = require('./routes/auth.route');

//app-level endpoints and endpoint handlers, các route prefix đều hardcoded không đổi
app.use('/', visitorRoutes);
app.use('/admin', adminRoutes); //req bắt buộc phải qua Absolute path "/admin" (gắn trực tiếp vào computer address http://localhost:port)
app.use('/nhanvien', nhanvienRoutes);
app.use('/quanlychinhanh', quanlychinhanhRoutes);
app.use(pdfRouter);
//app.use(authenticationRoutes);


createNewCongty(CongTy); 

app.listen(process.env.PORT||3002,"0.0.0.0", function () {
  console.log("server is running")
});

console.log("👉 #1: Sau khi chạy app.listen thì mới chạy các third party middlewares (chưa có incoming req từ người dùng ) rồi tới các middleware (đã có incoming req)")

//fill collection congties with data, bằng cách dùng Model để new một instance với dữ liệu tương ứng 

//Khai báo hàm chứ chưa gọi nó, nhưng hàm CongTy.countDocuments chạy luôn ngay khi npm start
//https://viblo.asia/p/su-dung-asyncawait-trong-javascript-gGJ59gVrZX2

async function createNewCongty(Congty) {
  let soLuongCongTy;

  //https://www.geeksforgeeks.org/mongoose-countdocuments-function/

  //SAI, countDocuments KHÔNG TRẢ Promise nha, vì vậy  CongTy.countDocuments({}, bị gọi tới 2 lần
  console.log("👉 #3. Hi, vừa vào createNewCongty")
  //https://stackoverflow.com/questions/55019621/using-async-await-and-then-together
  //hàm sau trả về Promise<number> tự viết hàm để xuất hiện bảng hướng dẫn cách sử dụng hàm
  Congty.countDocuments()
    .then(count => {

      console.log("👉 CongTy đã hoàn thành thực hiện countDocuments");
      console.log("Count:", count);
      soLuongCongTy = count;
      console.log("soLuongCongTy1:", soLuongCongTy);


      if (soLuongCongTy === 0) {
        const congty = new CongTy({
          Ma_so: "CT_1",
          Ten: "Công ty X",
          Dien_thoai: "028-123456",
          Dia_chi: "123",
          Qui_dinh_Nhan_vien: {
            Ma_so: "QD_1",
            Tuoi_Toi_thieu: 18,
            Tuoi_Toi_da: 55,
            Muc_luong_Toi_thieu: 5500000
          },
          Danh_sach_Ngoai_ngu: [{
              Ma_so: "ANH",
              Ten: "Anh"
            },
            {
              Ma_so: "PHAP",
              Ten: "Pháp"
            },
            {
              Ma_so: "NGA",
              Ten: "Nga"
            },
            {
              Ma_so: "DUC",
              Ten: "Đức"
            },
            {
              Ma_so: "Y",
              Ten: "Ý"
            }
          ],
          Danh_sach_Quan_ly_Chi_nhanh: [{

              Ho_ten: "Trần văn Khiêm",
              Ma_so: "QLCN_1",
              Ten_Dang_nhap: "QLCN_1",
              Mat_khau: "QLCN_1",
              Chi_nhanh: {
                Ten: "Chi nhánh A",
                Ma_so: "CN_1"
              }
            },
            {
              Ho_ten: "Lý thị Lan",
              Ma_so: "QLCN_2",
              Ten_Dang_nhap: "QLCN_2",
              Mat_khau: "QLCN_2",
              Chi_nhanh: {
                Ten: "Chi nhánh B",
                Ma_so: "CN_2"
              }

            }
          ],
          Danh_sach_Don_vi: [{
              Ma_so: "DV_1",
              Ten: "Dịch thuật",
              Chi_nhanh: {
                Ma_so: "CN_1",
                Ten: "Chi nhánh A"
              }
            },
            {
              Ma_so: "DV_2",
              Ten: "Đa năng A",
              Chi_nhanh: {
                Ma_so: "CN_1",
                Ten: "Chi nhánh A"
              }
            },
            {
              Ma_so: "DV_3",
              Ten: "Tư vấn du học 1",
              Chi_nhanh: {
                Ma_so: "CN_2",
                Ten: "Chi nhánh B"
              }
            },
            {
              Ma_so: "DV_4",
              Ten: "Tư vấn du học 2",
              Chi_nhanh: {
                Ma_so: "CN_2",
                Ten: "Chi nhánh B"
              }
            },
            {
              Ma_so: "DV_5",
              Ten: "Visa",
              Chi_nhanh: {
                Ma_so: "CN_2",
                Ten: "Chi nhánh B"
              }
            },
            {
              Ma_so: "DV_6",
              Ten: "Đa năng B",
              Chi_nhanh: {
                Ma_so: "CN_2",
                Ten: "Chi nhánh B"
              }
            }
          ]
        })
        return congty.save();
      }
      return count;
    })
    .catch(err => console.log(err))
}

const dateNow= Date.now();
console.log("❤️dateNow: ",dateNow ); 
//https://www.freecodecamp.org/news/javascript-date-now-how-to-get-the-current-date-in-javascript/

const today = new Date(dateNow);  
console.log("❤️todayObject:",today); //rất giống string format lưu trên mongodb, chính là ISO string format

//cần format lại

//follows the ISO 8601 Extended Format:
console.log("❤️today follows ISO 8601 Extended Format:",today.toISOString());
//UTC timezone format
console.log("❤️today follows UTC Timezone Format:",today.toUTCString());
// the date in a locality-sensitive format
console.log("❤️today follows locality-sensitive format:",today.toLocaleDateString());
//https://stackoverflow.com/questions/17003202/how-to-get-am-or-pm
//console.log trên server có thể dùng toán tử 3 ngôi để xử lý hiển thị 
console.log("❤️today follows locality date and time:hours:seconds",today.toLocaleDateString(),today.getHours(), ":" ,today.getMinutes(), ":",today.getSeconds() , (today.getHours() >= 12) ? "PM" : "AM"); //failed today.toLocaleDateString().getHours()

//ERRR, we caught an error: MongooseError: Operation insertOne buffering timed out after 10000ms
/// Lý do lỗi kỹ thuật này nằm ở đâu?? Không phải tất cả lý do (trong đó có lỗi cơ bản là lost connection to MongoDB) https://stackoverflow.com/questions/65680842/error-mongooseerror-operation-users-insertone-buffering-timed-out-after-1
//// Why? vì Model có thể gọi magic method của nó mà không cần điều kiện phải có mongodbConnected Mongoose, do đó gọi nhưng bị hanging trong kết nối CSDL nên cho vào buffer chờ tới khi có mongoose connected thành công thì gọi lần 2. Nhưng gọi lần 2 thì bị mongoose báo lỗi nhẹ nhàng không làm crash app: function already executed

//thử hàm reduce()

var array = [{
  "adults": 2,
  "children": 3
}, {
  "adults": 2,
  "children": 1
}];

//vế phải là hàm reducer 
var val = array.reduce(function(previousValue, currentValue) {
  return {
      adults: previousValue.adults + currentValue.adults,
      children: previousValue.children + currentValue.children
  }
});
console.log("❤️val là:",val);

var Danh_sach=[
  {
    Luot_bat_dau:"9/6/2022 , 15:5:54 PM",
    Luot_ket_thuc:"9/6/2022 , 17:5:54 PM",
    Noi_lam_viec:"nhà",
    So_phut_phien_lam_viec:120
  }, 

  {
    Luot_bat_dau:"9/6/2022 , 15:5:54 PM",
    Luot_ket_thuc:"9/6/2022 , 17:5:54 PM",
    Noi_lam_viec:"congty",
    So_phut_phien_lam_viec:180
  }
]

let val2 = Danh_sach.reduce(function(previousValue, currentValue) {
    //previousValue và currentValue là các thành phần của mảng Danh_sach
    //reduce() tính từ trái qua phải; reduceRight() tính từ phải qua trái
    return {
        Tong_phut_lam_viec: previousValue.So_phut_phien_lam_viec + currentValue.So_phut_phien_lam_viec,
    }
});

console.log("❤️val2 là:",val2);  //nice!!
console.log("Số h là: ", val2.Tong_phut_lam_viec/60); //nice!!
//OK Look good, ban đầu previousValue là object nhưng sau loop đầu tiên thì previousValue sẽ là Number, khi đó vòng lặp thứ hai previousValue sẽ là NaN vì không phải object previousValue.So_phut_phien_lam_viec
//🍒Solution: https://stackoverflow.com/questions/51755828/reduce-method-is-returning-nan-from-an-array-of-objects

