const UserModel = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
var cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: 'depjzfj9a', 
    api_key: '489915939841262', 
    api_secret: '5tBdTUHJ33XMIN3iP-49Rfeps9I',
    // secure: true
});

class UserController{
    static registerUser = async(req,res) => {
        // console.log(req.body)
        // console.log(req.files)

        const file = req.files.avatar
        const myCloud = await cloudinary.uploader.upload(file.tempFilePath,{
            folder : 'userImage'
        })

        const {name, userName, phone, email, password, conPassword, city, state, country} = req.body
        const user = await UserModel.findOne({email:email})
        if (user) {
            res.status(404).json({ status: "failed", message: "ᴛʜɪꜱ ᴇᴍᴀɪʟ ɪꜱ ᴀʟʀᴇᴀᴅʏ ᴇxɪᴛꜱ😓" });
        } else {
            if (name && email && password && conPassword) {
                if (password === conPassword) {
                    try{
                        // const salt = await bcrypt.genSalt(10)
                        // const hashPassword = await bcrypt.hash(password,salt)
                        const hashPassword = await bcrypt.hash(password,10)
                        const data = new UserModel({
                            name: name,
                            userName: userName,
                            phone: phone,
                            email: email,
                            password: hashPassword,
                            city: city,
                            state: state,
                            country: country,
                            avatar: {
                                public_id: myCloud.public_id,
                                url: myCloud.secure_url,
                            },
                        })
                        await data.save()
                        res
                        .status(201)
                        .json({ status: "success", message: "User Registration Successfully 😃🍻"});
                    }catch(err){
                        console.log(err)
                    }
                } else {
                    res.status(404).json({ status: "failed", message: "'Password and Confirm Password does not match😓" });
                }
            } else {
                res.status(404).json({ status: "failed", message: "All Fields are required😓" });
            }
        }
    }

    static loginUser = async(req,res) => {
        try{
            // console.log(req.body)
            const {email, password} = req.body
            // console.log(password)
            if (email && password) {
                const user = await UserModel.findOne({email : email})
                // console.log(user)
                if (user != null) {
                    const isMatched = await bcrypt.compare(password,user.password)
                    if ((user.email === email) && isMatched) {
                        //generate jwt token
                        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY);
                        // console.log(token)
                        res.cookie('token',token)
                        res
                        .status(201)
                        .json({ status: "success", message: "Login successfully with web token 😃🍻", token, user});
                    } else {
                        res.status(401).json({ status: "failed", message: "'Email and Password is not valid !😓" });
                    }
                } else {
                    res.status(401).json({ status: "failed", message: "'You are not registered user😓" });
                }
            } else {
                res.status(401).json({ status: "failed", message: "'All Fields are required 😓" });
            }
        }catch(err){
            console.log(err)
        }
    }

    static logout = async(req,res) => {
        // try{
        //     res.clearCookie('token')
        //     res.send({ status: "success", message: "Logout successfully !😓" });
        // }catch(err){
        //     console.log(err)
        // }
        try {
            res.cookie("token", null, {
                expires: new Date(Date.now()),
                httpOnly: true,
            });

            res.status(200).json({
                success: true,
                message: "Logged Out",
            });
        } catch (error) {
            console.log(error)
        }
    }

    static updatePassword = async(req,res) => {
        // console.log(req.user)
        try{
            const { oldPassword, newPassword, confirmPassword } = req.body

            if (oldPassword && newPassword && confirmPassword) {
                const user = await UserModel.findById(req.user.id);
                const isMatch = await bcrypt.compare(oldPassword, user.password)
                //const isPasswordMatched = await userModel.comparePassword(req.body.oldPassword);
                if (!isMatch) {
                    res.status(201).json({ "status": 400, "message": "Old password is incorrect" })
                } else {
                    if (newPassword !== confirmPassword) {
                        res.status(201)
                        .json({ "status": "failed", "message": "password does not match" })
                    } else {
                        const salt = await bcrypt.genSalt(10)
                        const newHashPassword = await bcrypt.hash(newPassword, salt)
                        //console.log(req.user)
                        await UserModel.findByIdAndUpdate(req.user.id, { $set: { password: newHashPassword } })
                        res.status(201)
                        .json({ "status": "success", "message": "Password changed succesfully" })
                    }
                }
            } else {
                res.status(201)
                        .json({ "status": "failed", "message": "All Fields are Required" })
            }
        }catch(err){
            res.status(201)
                        .json(err)
        }
    }

    static updateProfile = async(req,res) => {
        try{
            // console.log(req.params.id)
            // console.log(req.body)
            // console.log(req.files.avatar)
            // const { name, email } = req.body
            const { name, userName, phone, city, state, country } = req.body
            // console.log(user)
            const userImg = await UserModel.findById(req.params.id)
            // console.log(userImg)
            const imageId = userImg.avatar.public_id
            // console.log(imageId)
            await cloudinary.uploader.destroy(imageId)
            const file = req.files.avatar
            // console.log(file)
            const myCloud = await cloudinary.uploader.upload(file.tempFilePath,{
                folder : 'userImage'
            })
            const data = await UserModel.findByIdAndUpdate(req.params.id,{
                name : name,
                userName : userName, 
                phone : phone, 
                city : city, 
                state : state, 
                country : country,
                avatar: {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                },
            })
            await data.save()
            res
            .status(201)
            .json({ status: "success", message: "User Profile updated Successfully 😃🍻", data});
        }catch(err){
            res.json(err)
        }
    }

    //AdminOnly
    static getAllUser = async(req,res) => {
        try{
            const data = await UserModel.find()
            res.status(200).json({
                data
            })
        }catch(err){
            res.send(err)
        }
    }

    static getSingleUser = async(req,res) => {
        try{
            const data = await UserModel.findById(req.params.id)
            res.status(200).json({
                success: true,
                data
            })
        }catch(err){
            console.log(err)
        }
    }

    static getUserDetail = async (req, res) => {
        try {
        //   console.log(req.user);
          const user = await UserModel.findById(req.user.id);
    
          res.status(200).json({
            success: true,
            user,
          });
        } catch (error) {
          console.log(error);
        }
    };

    static deleteUser = async(req,res) => {
        try{
            const data = await UserModel.findByIdAndDelete(req.params.id)
            res
            .status(200)
            .json({ status: "success", message: "User deleted successfully 😃🍻"});
        }catch(err){
            console.log(err)
        }
    }

    static updateUserRole = async(req,res) => {
        try{
            // console.log(req.body)
            // const { role } = req.body
            const { name, email, password, avatar, role } = req.body
            const data = await UserModel.findByIdAndUpdate(req.params.id,{
                role : role,
            })
            await data.save()
            res
            .status(201)
            .json({ status: "success", message: "User Role updated Successfully 😃🍻"});
        }catch(err){
            res.send(err)
        }
    }
}
module.exports = UserController