import { notAuth } from "./handle_error";

// export const isAdmin=(req,res,next)=>{
    module.exports = function isAdmin(req,res,next){
    const {role}=req.user;
    // console.log("role:",role);
    if(role!=='R2') return notAuth('You are not authorized to access role Admin',res);
    next();
}

export const isModeratorOrAdmin=(req,res,next)=>{

    const {role}=req.user;
    if(role!=='R2' && role!=='R1') return notAuth('You are not authorized to access role Moderator or Admin',res);
    next();
}
