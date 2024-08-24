import { User } from "../models/user.model.js";
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';




// ............................................................Registration

const userRegister = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (
      ![username, email, password].every((field) => field?.trim())
    ) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
        error: true,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email is already in use",
        success: false,
        error: true,
      });
    }

    

    // const EncPaasword = await bcrypt.hash(password, 10)

    // // Create a new user instance
    // const newUser = new User({
    //   username,
    //   lastname,
    //   email,
    //   password : EncPaasword,
    // });

    // Create a new user instance
    const newUser = new User({
      username,
      email,
      password,
    });


    const savedUser = await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      success: true,
      data: savedUser,
      token: await newUser.generateToken(),
      // userId : userCreated._id.toString(),
      error: false,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "User registration failed",
      error: true,
      success: false,
    });
  }
};

// ..............................................................Login

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const userExist = await User.findOne({ email });
    // console.log(userExist);
    if (!userExist) {
      return res.status(400).json({
        message: "Invalid Credentials",
        error: true,
        success: false,
      });
    }


    const isMatch = await bcrypt.compare(password, userExist.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid Credentials",
        error: true,
        success: false,
      });
    }

    const token = await userExist.generateToken();

    res.status(200).json({
      message: "User Login Successfully !!",
      token: token,
      data : userExist._id,
      role: userExist.role,
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({
      message: "Server Error",
      error: true,
      success: false,
    });
  }
};


// ..............................................................user profile 
const profile = async (req, res) => {
  const token = req.header('auth-token');
  if (!token) {
    console.log("No token provided");
    return res.status(401).send('Access denied');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN_KEY);
    console.log("Token decoded:", decoded);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      console.log("User not found");
      return res.status(404).send('User not found');
    }
    res.send(user);
  } catch (err) {
    console.log("Error:", err.message);
    res.status(400).send('Invalid token');
  }
};


//................................................................forget
const ForgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.send({ Status: "User not existed" });
    }

    // Generate a reset token
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET_TOKEN_KEY, { expiresIn: '1h' });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.EMAIL_APP_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.MY_EMAIL,
      to: user.email,
      subject: 'Reset Password Link',
      text:`http://localhost:5173/reset_password/${user._id}/${token}` 
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res.send({ Status: "Failed to send email" });
      } else {
        return res.send({ Status: "Success", token: token, message: info});
      }
    });
  } catch (err) {
    res.send({ Status: err.message });
  }
};



//..............................................................ResetPssword

const ResetPassword = async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN_KEY);

        if (decoded.id !== id) {
            return res.json({ Status: "Error with token" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });
        
        if (user) {
            res.send({ Status: "Success" });
        } else {
            res.send({ Status: "User not found" });
        }
    } catch (err) {
        res.json({ Status: "Error with token", Error: err.message });
    }
};



export { userRegister, userLogin, ForgetPassword, ResetPassword, profile } 
