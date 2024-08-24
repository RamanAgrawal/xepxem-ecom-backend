import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: "String",
      required: true,
    },

    email: {
      type: "String",
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: "String",
      required: [true, "Password is required"],
    },

    role: {
      type: "String",
      default: "user",
      enum: ["user", "admin"],
    },

    token:{
      type : String,
    },
  },
  
  { timestamps: true }
);





// using this method all acess all your feild which is  about to be save
// you can also console this 

userSchema.pre('save', async function(next) {
  const user = this;
  // console.log(user);
  if (!user.isModified("password")) {
    return next();
  }

  try {
    const hash_password = await bcrypt.hash(user.password, 10);
    user.password = hash_password;
    // console.log('Hashed password before saving:', user.password); 
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.generateToken = function () {
  try {
    return jwt.sign(
      {
        userId: this._id.toString(),
        email: this.email,
        role: this.role,
      },
      process.env.JWT_SECRET_TOKEN_KEY,
      {
        expiresIn: "10d"
      }
    );
  } catch (error) {
    console.error("error", error);
    throw new Error('Token generation failed');
  }
}


const User = mongoose.model("User", userSchema);

export { User };
