//dựa vào req.session.user được set sau khi log in thành công

exports.nhanvienIfLoggedIN=(req,res,next)=>{
    
    if(!req.session.user){  
        return res.redirect('/nhanvien/login');
    }
    next();
}

exports.adminIfLoggedIn=(req,res,next)=>{
    if(!req.session.admin){   
        return res.redirect('/admin/login');
    }
    next();
}

exports.qlcnIfLoggedIn=(req,res,next)=>{
    if(!req.session.quanlychinhanh){   
        return res.redirect('/quanlychinhanh/login');
    }
    next();
}