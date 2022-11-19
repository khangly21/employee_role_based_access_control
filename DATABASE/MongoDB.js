const mongoose = require('mongoose');

module.exports = async function createDatabase() {
  
   let connectedMongoose=await mongoose.connect(process.env.MONGODB_URI);  
   
   console.log("👉 #5. connected!, tiếp theo (cũng không cần theo thứ tự) thì first collection được tạo đồng nghĩa với sau đó database cũng được tạo");
   console.log("Trong lập trình mongoose.model() và mongooseModel.method() đâu cần phải mongoose.connect trước, cứ chạy model rồi buffering waiting/hanging cho tới khi connect mới query CSDL được")
   return connectedMongoose.model('CONGTY', require('../SCHEMAS/congty.schema'));
};

