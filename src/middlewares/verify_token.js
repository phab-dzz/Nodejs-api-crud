import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { notAuth } from './handle_error';


const verifyToken = (req,res,next) => {
    const token=req.headers.authorization;
    if(!token) return notAuth('required authorization token',res);
    const accesToken=token.split(' ')[1];
    jwt.verify(accesToken,process.env.JWT_SECRET,(err,user)=>{
        if(err) 
        {
            const isChecked=err instanceof TokenExpiredError;
            if(!isChecked) return notAuth('Access token invalid',res,isChecked);
        if(isChecked) return notAuth('Access token Expired',res,isChecked);
      
        }
        req.user=user;
        next();
    });
}
export default verifyToken;