//gọi model

exports.getIndex=(req,res,next)=>{
   
    res.render('index',{
       
        role: req.session.admin? req.session.admin.Role
            : (req.session.user ? req.session.user.Role
            : (req.session.quanlychinhanh? req.session.quanlychinhanh.Role
            : 'visitor')),
        message:'',
     
        isLoggedIn:req.session.admin?true:(req.session.user?true:(req.session.quanlychinhanh?true:false)),
        pageRegister :true,
        pageLogin :true,

        
        
    });
}