import User from "../models/user.model.js"; 
import jwt from 'jsonwebtoken' ;

export const protectRoute = async(req, res, next) => {
    try{
        const token = req.cookies.jwt ;
        if(!token){
            return res.status(401).json({
                error: "Unauthorized: No Token Provided"
            }) ;
        } 

        const decoded = jwt.verify(token, process.env.JWT_SECRET) ; 
        if(!decoded){
            return res.status(401).json({
                error: "Unauthorised: Invalid Token",
            }) ;
        }
        const user = await User.findById(decoded.userId).select("-password") ;
        if(!user){
            return res.sttaus(404).json({
                error: "User not found!",
            }) ;
        }

        req.user = user ; 
        next() ;
    }catch(error){
        console.log(`${error.message}`) ;
    }
}