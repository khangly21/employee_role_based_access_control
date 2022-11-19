const mongoose=require('mongoose');
//https://stackoverflow.com/questions/49956870/mongoose-model-required-and-with-default
// from the docs: Note: Mongoose only applies a default if the value of the path is strictly undefined
//💊 https://stackoverflow.com/questions/70422763/mongoose-instance-methods
//💊 https://stackoverflow.com/questions/29664499/mongoose-static-methods-vs-instance-methods

const nhanvienSchema=new mongoose.Schema({
    Ho_ten:{type: String, required: true}, 
    Ma_so:{type: String, required: true}, 
    Ten_Dang_nhap:{type: String, required: true}, 
    Mat_khau:{type: String, required: true}, 
    Gioi_tinh:{type: String, required: true}, 
    CMND:{type: String, required: true}, 
    Dien_thoai:{type: String, required: true}, 
    Dia_chi:{type: String, required: true}, 
    Mail:{type: String, required: true}, 
    Ngay_sinh:{type: String, required: true}, 
    Role:{type: String, required: true} ,
    Don_vi:{
        Ten:{type: String, required: true}, 
        Ma_so:{type: String, required: true}, 
        Chi_nhanh:{
            Ten:{type: String, required: true}, 
            Ma_so:{type: String, required: true}
        }, 
    }, 
    Danh_sach_Ngoai_ngu:[
        {
            Ten:{type: String, required: true}, 
            Ma_so:{type: String, required: true}
        }
    ],
    annualLeave:{
        type:Number,
        min:0,
        max:12
    },
    imageMulterPath: {
        type: String,
        required: true
    },
    salaryScale:Number,
})

//mongoose instance 's method rõ nhất là save()
//https://stackoverflow.com/questions/7419969/how-do-i-define-methods-in-a-mongoose-model (static/class method)
// assign a function to the "methods" object of our animalSchema
nhanvienSchema.methods.findSimilarGender = function () {
    return this.model('NHANVIEN').find({gender: this.Gioi_tinh });
}

/* //công thức cho tự định nghĩa instance method:
    LocationSchema.methods.testFunc = function testFunc(params, callback) {
        //implementation code goes here
    }

*/

//https://stackoverflow.com/questions/64297887/javascript-search-by-object-attribute

nhanvienSchema.methods.findForeignLanguageByMaNgoaiNguVoiSearchWords=function(searchString){
    let filteredNgoaingu=this.Danh_sach_Ngoai_ngu.filter(ngoaingu=>{
        //The includes() method is case sensitive , trả về true nếu tìm ra, false nếu không tìm ra 👉 https://www.w3schools.com/Jsref/jsref_includes_array.asp
        let upperCaseSearchString= searchString.toUpperCase();
        console.log("ngoai ngu là:", ngoaingu) //✔️
        return ngoaingu.Ma_so.includes(upperCaseSearchString);
    })
    console.log(typeof searchString); //string
    console.log(typeof filteredNgoaingu) //object
    if(filteredNgoaingu === []){ 
        //nếu if(filteredNgoaingu === []) sẽ báo lỗi bởi Snyk: "Array literal never equals to any other value by itself. Be aware that this comparision is compare references and not values". Sẽ trả về false
        return "Không tìm thấy ngoại ngữ theo chuỗi tìm kiếm đó"
    }

    //https://stackoverflow.com/questions/35235794/filter-strings-in-array-based-on-content-filter-search-value
    //https://www.freecodecamp.org/news/check-if-javascript-array-is-empty-or-not-with-length/
        /// không có hàm js nào trực tiếp mà phải thông qua length?? thực ra có isEmpty() lúc controller thu thập validation errors ?? //👈SAI
        /*
            const errors=validationResult(req);   //VALIDATION ERROR COLLECTING 🧠
            //if there is error, VALIDATION ERROR RETURNING  🧠
            if(!errors.isEmpty()) { //CHÚ Ý: errors không là mảng và isEmpty() không là native function của mảng
        */
    /*
        if(filteredNgoaingu.isEmpty()){
            return "Không tìm thấy ngoại ngữ"
        }
        //TypeError: filteredNgoaingu.isEmpty is not a function
    */

    //Không thể so sánh object với object, nên cách duy nhất là
    if (filteredNgoaingu.length === 0) { return "Không tìm thấy ngoại ngữ" }   //✔️
    return filteredNgoaingu;

}
module.exports = nhanvienSchema