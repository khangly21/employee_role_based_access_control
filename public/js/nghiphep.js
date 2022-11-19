// var jsdom = require("jsdom");
// const { JSDOM } = jsdom;
// const { window } = new JSDOM();
// const { document } = (new JSDOM('')).window;
// global.document = document;
// var $ = require("jquery")(window);
//dùng nhóm trên $ để export ra ngoài khỏi báo lỗi $ not defined
//Model class
const Dog=require('../../models/dog');

var date=1;
var hour=1;
var elementS=document.getElementsByClassName('section_removable'); //chú ý có s tức là nhiều phần tử có cùng class name
var r= document.getElementById('section_removable');
var s=document.getElementsByTagName('article')
var t=document.getElementsByClassName('')
//jquery $ được định nghĩa trong layout.js

function add_fields(){
    //date++;   //${date} mà nhận NaN nghĩa là anh date này undefined, vì chưa truyền biến tham số cho hàm
    //để ý khi add_fields có date thì date bên ngoài thất nghiệp, còn không có tham số date thì date trên cao hoạt động
    //hour++;

    var objTo=document.getElementById('fields_unremovable');

    var DateAdded=document.createElement("div");

    //thay vì ' ' chỉ viết trên 1 dòng, thì dùng ` ` là Template Literal để viết trên nhiều dòng , ngoài ra cũng ngay lập tức dùng template literal bên trong
    //https://www.w3schools.com/JS//js_string_templates.asp nói về chủ đề "String Template"
        ///Template Literals use back-ticks (``) rather than the quotes ("") to define a string:  let text = `Hello World!`;
         ///Template literals provide an easy way to interpolate variables and expressions into strings. The method is called ("string interpolation") là nội suy chuỗi. The syntax is: ${...}
    DateAdded.innerHTML=`
        <article class="section_removable">
            <div class="container">
            
                <div class="row"> 

                    <div class="col-sm-3">
                        <div> Date  : </div>   
                        <input class="w3-text-orange" type="date" name="date_to_off" value="" >
                    </div> 

                    <div class="col-sm-3">
                        <div>Hours :</div>
                        <input name="hour_to_off" class="w3-text-blue hours" step="0.01" type="number" min="1" max="8" value="" > <span style="color:greenyellow">(max:8h)</span>
                   
                    </div> 
                </div>
            </div>
        </article>`

    objTo.appendChild(DateAdded);
}

function delete_this_date(){
    /* https://stackoverflow.com/questions/4777077/removing-elements-by-class-name */
    while(elementS.length > 0){
        elementS[0].parentNode.removeChild(elementS[0]);
    }
}

// function Tinh_so_ngay_phep_nam(so_h_dang_ky_nghi_phep){
//     var songay= so_h_dang_ky_nghi_phep/8 ;
// }


function sum_registered_hours(){ //không cần hàm là 1 mảng nào hết vì mảng động như linked list không biết chính xác length, so với cách truyền thống là https://www.kindacode.com/article/javascript-ways-to-calculate-the-sum-of-an-array/  với mảng tĩnh 
    var sumChia8=0.0
    var sum=0;
    
    //https://stackoverflow.com/questions/7053511/javascript-sum-values
    //trong layout đã có jquery.min.js nằm cuối file (để khỏi cản trở html) sẵn sàng để sử dụng
    //if You are giving same id to multiple elements thì trái quy tắc. Give class instead $('.hours'). Then get their sum.
    /*
        var arr = ["20.0","40.1","80.2","400.3"],
            sum = 0;
        $.each(arr,function(){sum+=parseFloat(this) || 0;});
    */
    
    $('.hours').each(function(){
        sum += parseInt(this.value); //Lấy giá trị của thuộc tính value của từng input element
        sumChia8=parseFloat(sum/8); //nếu ghi sumChia8=parseFloat(this.value/8); thì có 2 input 2,3 thì sumChia8 lấy input cuối cùng là 3/8=0.375, còn sumChia8=parseFloat(sum/8); sẽ là 0.625 đúng
        //để $(this) là sai
        //Cách 1: vanilla javascript, no framework, no library
           ///document.getElementById("target_for_sum_hours").innerHTML = sum;
        //Cách 2: Dùng jquery library
        window.alert(sum) //đây là cách debug trong jquery, không dùng console.log được
        window.alert("GIÁ TRỊ sumChia8:")
        window.alert(sumChia8)
        //gán
        $("#target_for_sum_hours").html(sum); //số giờ phép năm đã đăng ký
        $("#target_for_day_in_var").html(sumChia8)
          
        //Quy đổi: 1 ngày phép năm = 8h đăng ký
        //let songay=Tinh_so_ngay_phep_nam(sum); 

        /*
        $("#target_for_day").html(sumchia8).promise().done(function(){
            window.alert(sum/8) //chạy song song html(sum/8) nhưng alert kết thúc nhanh hơn nên hiện ra trước
            const sumchia8=sum/8;
            window.alert("sumchia8 là: \n",sumchia8)

        })
        */

        $("#target_for_day").html(sum/8).promise().done(function(){
            // window.alert(sum/8) //chạy song song html(sum/8) nhưng alert kết thúc nhanh hơn nên hiện ra trước
            // const sumchia8=sum/8;
            // window.alert(sumchia8)
            // window.alert("sumChi8")
            // window.alert(sumChia8)
        })

        
        
        //lưu giá trị của html element có id là #target_for_day vào 1 biến để có thể access giá trị đó globally
        // const x= document.getElementById('target_for_day').value;
        // console.log("gia tri x tu html element là: \n", x);

        
        
    }
        
    
    );
    
    

    //https://api.jquery.com/promise/
    
    // $('.hours')
    // .promise().done(function(){
    //     window.alert("done for '#target_for_sum_hours' and '#target_for_day'  "); //tuy nhiên vẫn alert SAU khi gán vào '#target_for_sum_hours' and '#target_for_day'
        
    // }).promise().done(function(){
    //     window.alert('fish')
    // }).promise().done(function(){
    //     const So_ngay_phep_nam_da_dang_ky= document.getElementById('target_for_day').innerHTML;  //value hay innerHTML? DÙNG value trong trường hợp 1 button có thuộc tính value và cần lấy giá trị của thuộc
    //     window.alert("gia tri x tu html element là: \n",So_ngay_phep_nam_da_dang_ky); //undefined
    //     const jquery_So_ngay_phep_nam_da_dang_ky=$('#target_for_day').html()  //3 lựa chọn là hàm html() hoặc text() hay val()
    //     window.alert("jquery_So_ngay_phep_nam_da_dang_ky: \n",jquery_So_ngay_phep_nam_da_dang_ky)
    // })

    //Không thể gọi hàm hay viết hàm trong ejs file, vì sẽ báo lỗi undefined

    
    
}

//không có tác dụng do không có res,req,next
function store_target_for_day_value(){
    alert("lưu ngaynghidangky vào CSDL?")
    //lưu sumChia8 vào CSDL với thuộc tính ngaynghiphepnamdangky, sau đó do đây không là middleware nên không tiếp xúc req,res,next
        //https://mongoosejs.com/docs/tutorials/findoneandupdate.html
        const filter = { _id: req.user._id };
        const update = { ngaynghiphepnamdangky: 8 };
        Dog.findByIdAndUpdate(filter,update)
           .exec() //hover findByIdAndUpdate thấy không trả về Promise nào
           .then(result=> console.log(result))
           .catch(err=>console.log(err))

    //Sau khi có biến sumChia8 thì sẽ lưu vào CSDL bảng attendancediaries , thuộc tính registeredDayLeave
}

//jquery cho HTML button #jquery_store_songayphepnamdadangky_vao_bien, gắn HTML element này binds vào sự kiện onclick, callback ngay sau đó
$('#jquery_store_songayphepnamdadangky_vao_bien').on("click",function(){
    window.alert("đã click vào HTML button #jquery_store_songayphepnamdadangky_vao_bien");
    $("#longtermTarget").html("Hello <b>world!</b>"); //tag b sẽ không có tác dụng trong alert
    //Lấy giá trị vừa gán 
    $("#longtermTarget").promise().done(function(){
        var total = $("#longtermTarget").html() ;
        alert("your total is :"+ total ); //debug SAU
    })
})

// $(document).ready(()=>{}) đã bị deprecated
$(function() {
    var total = $("#longtermTarget").html() ;
    alert("your total is :"+ total );     //debug TRƯỚC
});

//https://stackoverflow.com/questions/3922994/share-variables-between-files-in-node-js
//exports.ngaynghidangky=sumChia8;  //không có tác dụng và là 0.0


//Không thể vì không có route endpoint
// exports.goingaynghidangky=(req,res,next)=>{
//     res.render('staff/nghiphep.ejs',{
//         ngaynghidangky:sumChia8
//     })
// }

function authen_inputValues(){
    window.alert("authen_inputValues -> Tổng giờ đăng ký nghỉ phải nhỏ hơn annualLeave");
    // Selecting the input element and get its value 
    let annualLeave_on_mongodb = document.getElementById("annualLeave").value;
    console.log(typeof(annualLeave_on_mongodb));
    let registered_offdays=document.getElementById("registered_offdays").value;
    console.log(typeof(registered_offdays))

    alert(annualLeave_on_mongodb); //ok
    alert(registered_offdays); //ok
    if(parseFloat(registered_offdays) > parseFloat(annualLeave_on_mongodb)){
        alert("ngày đăng ký nghỉ phép phải nhỏ hơn phép năm hiện tại!")  //sẽ xuất hiện khi so sánh 21.323 vs 16
    }
}