import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/users.js";

export async function getAllUsers(req, res){
    try {
        
        if(req.user.role !== "admin"){
            return res.status(401).json({message: "Unauthorized"});
        }
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}

export async function createUser(req, res){
    try{
        //UID36001
        const lastUser = await User.find().sort({ date: -1 }).limit(1);
        console.log(lastUser);
        let uId = "UID36001";
        if(lastUser.length > 0){
            const lastUserInString = lastUser[0].userId;
            const lastUserWithoutPrefix = lastUserInString.replace("UID", "");
            const lastUserInteger = parseInt(lastUserWithoutPrefix);
            const newUserInteger = lastUserInteger + 1;

            const newUserIntegerString = newUserInteger.toString();
            const newUserString = "UID" + newUserIntegerString;

            uId = newUserString;
        }


        const hashPassword = await bcrypt.hash(req.body.password, 10);

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