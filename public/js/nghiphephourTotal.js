var $=require('jquery')(window)

export function calculateSumOfNghiphepHours(){
    var sum = 0;
  
    //Required: jquery! $  👉 tham khảo ASM1 >> staffController
    //npm install --save jquery  

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
		$("#sum").html(sum.toFixed(2));    //dành cho giá trị giữa html's span tag. Lý do là span không phải input which has this.value

    })
}