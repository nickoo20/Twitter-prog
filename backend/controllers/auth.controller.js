import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs' ;


export const signup = async(req, res) => {
    try{
        const {username, email, fullName, password} = req.body ; 

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ ;
        if(!emailRegex.test(email)){
            return res.status(400).json({
                error: "Invalid email format!",
            }) ;
        }

        const existingUser = await User.findOne({username}) ;
        if(existingUser){
            return res.status(400).json({
                error: "Username is already taken!",
            }) ;
        }

        const existingEmail = await User.findOne({email}) ;
        if(existingEmail){
            return res.status(400).json({
                error: "Email is already taken!",
            })
        }

        if(password.length < 6) return res.status(400).json({
            error:"Password must be atleast 6 characters long",
        })

        // hash password
        const salt= await bcrypt.genSalt(10) ;
        
        const hashedPassword = await bcrypt.hash(password, salt) ;
        const newUser = new User({
            fullName,
            email,
            password:hashedPassword,
            username,
        }) ;

        if(newUser){
            generateTokenAndSetCookie(newUser._id, res) ;
            await newUser.save() ;
            return res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                followers:newUser.followers,
                following:newUser.following,
                profileImg:newUser.profileImg,
                coverImg:newUser.coverImg,
            }) ;
        }else{
            return res.status(400).json({
                error: "Invalid user data"
            })
        }

    }  catch(error){
        console.log(`Error in Signup Controller, ${error.message}`) ;
        return res.status(500).json({
            error: "Internal Server error",
        }) ;
    }
}

export const login = async(req, res) => {
   try{
        const {username, password} = req.body ; 
        const user = await User.findOne({username}) ;
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "") ;

        if(!user || !isPasswordCorrect){
            return res.status(400).json({
                error : "Invalid username or password!",
            }) ;
        }
        generateTokenAndSetCookie(user._id, res) ;
        // const users = await User.findOne({username}).select("-password") ;
        // return res.status(200).json(users) ;
         
        return res.status(200).json({   
            _id : user._id,
            username: user.username,
            email : user.email, 
            fullName: user.fullName,
            followers:user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
        }) ;

   }catch(error){
        console.log(`Error in Login Controller, ${error.message}!`) ;
        return res.status({
            error: "Internal Server error",
        }) ;
   }
}

export const logout = async(req, res) => {
    try{
        res.cookie("jwt","") ;
        return res.status(200).json({
            message: "Logged Out successfully!",
        }) 
    }catch(error){
        console.log(`Error in Logout controller, ${error.message}`); 
        return res.status(500).json({
            error : "Internal server error!",
        }) ;
    }
}

export const getMe = async(req, res) => {
    try{
        const user = await User.findById(req.user._id).select("-password") ;
        res.status(200).json(user) ;  
    }catch(error){
        console.log(`Error in getMe controller, ${error.message}`) ;
        return res.status(500).json({
            error : "Internal Server Error!",
        }) ;
    }
}
