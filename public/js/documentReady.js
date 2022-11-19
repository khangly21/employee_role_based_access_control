

//Làm tương tự file differentRainDrops.js

var calculateSumOfNghiphepHours= function (){
    var sum = 0;
  
    //Required: jquery! $  👉 tham khảo ASM1 >> staffController
    //npm install --save jquery  
    
     //https://www.geeksforgeeks.org/how-to-get-the-value-in-an-input-text-box-using-jquery/
     //window.alert($("#sum").val()) //get giá trị của đối tượng input, còn muốn set giá trị input thì .val("hello") //nếu ghi window.alert("giá trị input sum là:",$("#sum").val()) sẽ chỉ hiển thị "giá trị input sum " 
     //window.alert($("#sum").value); //undefined, vì $ không có property value
    //iterate through each textboxes and add the values
    $(".hours").each(function(){
        //add only if the value is number
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isNaN
        //isNaN("2")   --> đầu vào là chuỗi nhưng vẫn đánh giá 2 là number 
        if(!isNaN(this.value) && this.value.length!=0) {
            //Snyk says: Using isNaN may leads to unexpected behaviour/result.Consider the more robust Number.isNaN instead
            sum += parseFloat(this.value);
        }
        //.toFixed() method will roundoff the final sum to 2 decimal places
		//$("#sum").html(sum.toFixed(2)); //👈dành cho nội dung của span (Change the content of all span element)
        $("#sum").val(sum.toFixed(2));  //👈dành cho nội dung của thẻ input. set nội dung của #sum
        var so_gio_phep_nam_con_lai=$("#annualLeaveHours").val();
        //window.alert(so_gio_phep_nam_con_lai)   //ok
        //xét điều kiện sau khi $("#sum") nhận những giá trị đầu tiên
        if(so_gio_phep_nam_con_lai){
            // window.alert($("#sum").val()); //Sum of hours = 3.00
            // window.alert(so_gio_phep_nam_con_lai); //264.00
            // window.alert($("#sum").val() - so_gio_phep_nam_con_lai) //-261
            // window.alert(3.00-246) //-243
            if($("#sum").val()-so_gio_phep_nam_con_lai >0 ){ //💢vì sao ghi if($("#sum").val() >so_gio_phep_nam_con_lai ) sẽ bị false và báo lỗi
                //hàm này của nodejs sẽ chạy trước $("#sum").val() nên sẽ chặn $("#sum").val hiển thị kết quả trong ô input
                window.alert("Tổng số giờ nghỉ phép (Sum of hours) không được lớn hơn Số giờ phép năm còn lại");
                $("#sum").val(0);//vì nếu bấm ok window.alert thì giá trị lớn sẽ không bị chặn nữa, nên phải set cho về 0
            }
        }else{
            window.alert("so_gio_phep_nam_con_lai is undefined now (có thể thiếu # cho id hay . cho class)")
        }
        
    })

   
}



//ready is deprecated, use $(function(){})


//👉 CÁCH 1
//$(function(){
    //iterate through each textboxes and add keyup
    //handler to trigger sum event
    //$(".hours").each(function() {
        // $(this).keyup(function(){}) is deprecated, use .on() or .trigger() instead
        //code sau vẫn chạy tốt
        // $(this).keyup(function(){
        //     calculateSumOfNghiphepHours();
        // });

        
    //});
//})

//code phía trên chỉ ra KQ khi hours có sẵn, còn hours thêm vào thì không tác dụng

//👉 CÁCH 2  ✅ WORKED
$(function () {
    //sự kiện là "change" hay "blur" cũng ok!
    //$(document).ready(function(){ thì this chính là document
    //https://www.tutorialrepublic.com/jquery-tutorial/jquery-get-and-set-css-properties.php
    $(this).on('blur', '.hours', function () {
        calculateSumOfNghiphepHours();
        //get input tag's value
        let gia_tri_cua_hoursSum=$("#sum").val();
        //set input tag's value
        $("#registered_offdays").val(gia_tri_cua_hoursSum/8); //chú ý: nếu input này có 2 ids cùng lúc thì không hiển thị số nào hết: VD id="songaynghidangky" và id="registered_offdays"
    })
});

//👉 CÁCH 3  --> .hours có sẵn thì cộng được, .hours được added thì không chạy

// $(function(){

//     $(".hours").each(function() {
//         // $(this).keyup(function(){
//         //     calculateSumOfNghiphepHours();
//         // });
//         // $(this).blur(function(){
//         //     calculateSumOfNghiphepHours();
//         // })
//         $(this).trigger('blur', '.hours', function () {
//             calculateSumOfNghiphepHours();
//         })


//     });
// })