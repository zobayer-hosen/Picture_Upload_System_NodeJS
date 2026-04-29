import userModel from "../models/user.model.js"
import crypto from "crypto"
import jwt from "jsonwebtoken"
import config from "../config/config.js"
import sessionModel from "../models/session.model.js"
import { AsyncLocalStorage } from "async_hooks"

export async function register(req,res) {
    const {username, email,password } = req.body
    const isAlreadyRegistered = await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    })
    if(isAlreadyRegistered){
        res.status(409).json({
            message: "User name is already exits"
        })
    }
    const hashedPassword = crypto.createHash("sha256").update(password).digest('hex');

    const user = await userModel.create({
        username,
        email,
        password:hashedPassword
    })

    const otp = generateOtp();
    const html = getOtpHtml(otp);

    const optHash = crypto.createHash("sha256").update(otp).digest("hex")
    await optModel.create({
        email,
        user:user._id,
        optHash
    })

    await sendEmail(email,"OTP Varification",`your OTP code is ${otp}`,html)

    res.status(201).json({
        message:"User registered successfully",
        user:{
            username : user.username,
            email: user.email,
            varfried : user.verified
        }
    })
    
}

export async function login(res,res) {
    const {emai, password} =req.body;
    const user = await userModel.findOne({email})

    if(!user){
        return res.status(401).json({
            message:"Invalid email or password"
        })
    }
    if(!user.varified){
        return res.status(401).json({
            message:"Email is not verified"
        })
    }

    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex")
    const isPasswordValid = hashedPassword === user.password;
    
    if(!isPasswordValid){
        return res.status(401).json({
            message:"Invalid email or password"
        })
    }
    const refreshToken = jwt.sign({
        id:user._id
    }.config.JWT_SECRET,{expiresIn: "7d"}
  )
  const refreshToken = crypto.createHash("sha256").update(refreshToken).digest("hex")
  const session = await sessionModel.create({
    user :user._id,
    refreshTokenHash,
    ip:req.ip,
    userAgent :req.headers["user-agent"]

  })

  const accessToken = jwt.sign({
    id:user._id,
    sessionId:session._id
  },config.JWT_SECRET,{
    expiresIn:"15m"
  })
  res.cookie("refreshToken",refreshToken,{
    httpOnly :true,
    secure : ture,
    sameSite:"strict",
    maxAge:7*24*60*60*1000//7 days
  })

  res.status(200).json({
    message:"Login in successfully",
    user:{
        username :user.username,
        email :user.email

    },
    accessToken,
  })
}