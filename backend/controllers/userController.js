import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/users.js";
import OTP from "../models/otp.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export async function getAllUsers(req, res){
    const sort = req.query.sort;
    const filterRole = req.query.role;

    let sortObject = {};
    let filter = {};

    if(filterRole == "user"){
        filter = {role: "user"};
    } 
    if(filterRole == "admin"){
        filter = {role: "admin"};
    }
    if(filterRole == ""){
        filter = {};
    }

    if(sort === "name"){
        sortObject = {name: 1};
    }else if(sort === "date"){
        sortObject = {date: -1};
    }else if(sort === "city"){
        sortObject = {city: 1};
    }else{
        sortObject = {}
    }

    try {
        if(req.user.role !== "admin"){
            return res.status(401).json({message: "Unauthorized"});
        }
        const users = await User.find(filter).sort(sortObject);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}

export async function createUser(req, res){
    try{
        //UID36001
        const lastUser = await User.find().sort({ date: -1 }).limit(1);
        let uId = "UID36001";
        if(lastUser.length > 0){
            const lastUserInString = lastUser[0].userId;  //"UID36001"
            const lastUserWithoutPrefix = lastUserInString.replace("UID", "");  //"36001"
            const lastUserInteger = parseInt(lastUserWithoutPrefix);   //36001
            const newUserInteger = lastUserInteger + 1; //36002

            const newUserIntegerString = newUserInteger.toString(); //"36002"
            const newUserString = "UID" + newUserIntegerString;  //"UID36002"

            uId = newUserString; //"UID36002"
        }

        const salt = await bcrypt.genSalt(10);

        const hashPassword = await bcrypt.hash(req.body.password, salt);

        const user = new User({
            userId: uId,
            name: req.body.name,
            email: req.body.email,
            password: hashPassword,
            phoneNumber: req.body.phoneNumber,
            address: req.body.address
        })

        const result = await user.save();
        res.status(201).json({
            message: "User created successfully",
            user: result
        });
        
    }catch(error){
        console.log(error);
        res.status(500).json({message: error.message});
    }
}

export async function loginUser(req, res){
    try{
        const email = req.body.email;
        const password = req.body.password;

        await User.findOne({email: email}).then(
            (user)=>{
                if(user === "null"){
                    res.status(404).json({message: "User not found"});
                }else{
                    const passwordMatch = bcrypt.compareSync(password, user.password);
                    if(passwordMatch){ 
                        const token = jwt.sign({
                            email: user.email,
                            userId: user.userId,
                            name: user.name,
                            address: user.address,
                            phoneNumber: user.phoneNumber,
                            role: user.role
                        }, process.env.JWT_SECRET,{
                            expiresIn: "1d"
                        })
                        res.status(200).json(
                            {
                                message: "Login successful",
                                role: user.role,
                                token: token
                            }
                        );
                    }else{
                        res.status(401).json({message: "Invalid credentials"});
                    }
                }
            }
        )


    }catch(error){
        res.status(500).json({message: error.message});
    }
}

export async function getUserById(req, res){
    try{

        const userId = req.params.id;
        const user = await User.findOne({userId: userId});
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json(user);

    }catch(error){
        res.status(500).json({message: error.message});
    }
}

// update user by id
export async function updateUserById(req, res){

    if(req.user == null || req.user.role === "admin"){
        return res.status(401).json({message: "Unauthorized"});
    }
    try{
        const userId = req.params.id;
        const updateData = req.body;

        const user = await User.findOne({userId: userId});
        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        const updatedUser = await User.updateOne(
            {
                userId: userId
            },
            updateData
        );

        res.status(200).json(
            {
                message: "User updated successfully",
                user: updatedUser
            }
        );

    }catch(error){
        res.status(500).json({message: error.message});
    }
}

// delete user by id
export async function deleteUserById(req, res){
    if(req.user == null || req.user.role !== "admin"){
        return res.status(401).json({message: "Unauthorized"});
    }
    try{
        const userId = req.params.id;
        const user = await User.findOne({userId: userId});
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        await User.deleteOne({userId: userId});
        res.status(200).json({message: "User deleted successfully"});
    }catch(error){
        res.status(500).json({message: error.message});
    }
}


// sendOTP to user email for password reset
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export async function sendOTP(req, res){
    try{
        const email = req.body.email;
        if(!email){
            return res.status(400).json({message: "Email is required"});
        }
        const user = await User.findOne({email: email});
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
    
        const otp = Math.floor(100000 + Math.random() * 900000); // generate 6 digit otp
        await OTP.deleteMany({email: email}); // delete all otp from the email
        const newOTP = new OTP(
            {
                email: email,
                otp: otp
            }
        )
        await newOTP.save();
        // send otp to user email
        const message = {
            from: `"Kani Company" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is ${otp}. It is valid for 10 minutes.`
        }
        transporter.sendMail(message,
            (err, info)=>{
                if(err){
                    console.log(err);
                    res.status(500).json({
                        message: "Error sending OTP",
                        error: err
                    });
                }else{
                    console.log("OTP sent successfully", info.response);
                    res.status(200).json({message: "OTP sent successfully"});
                }
            }
        );
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

//reset password using OTP
export async function resetPassword(req, res){
    try{
        const email = req.body.email;
        const otp = req.body.otp;
        const newPassword = req.body.newPassword;

        const otpRecord = await OTP.findOne({email: email, otp: otp});
        if(!otpRecord){
            return res.status(400).json({message: "Invalid OTP"});
        }
        const user = await User.findOne({email: email});
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(newPassword, salt);

        await User.updateOne(
            {email: email},
            {password: hashPassword}
        );
        await OTP.deleteOne({email: email});
        res.status(200).json({message: "Password reset successfully"});
       
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

// update user role by id
export async function updateUserRole(req, res){
    if(req.user.role !== "admin"){
        return res.status(401).json({message: "Unauthorized"});
    }
    try{
        const userId = req.params.id;
        const newRole = req.body.role;

        const user = await User.findOne({userId: userId});
        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        const updatedUser = await User.updateOne(
            {
                userId: userId
            },
            {role: newRole}
        )
        res.status(200).json(
            {
                message: "User role updated successfully",
                user: updatedUser
            }
        );

    }catch(error){

        res.status(500).json({message: error.message});
    }
}

export function isAdmin(req){
    if(req.user == null){
        return false;
    }
    if(req.user.role !== "admin"){
        return false;
    }
    return true;
}