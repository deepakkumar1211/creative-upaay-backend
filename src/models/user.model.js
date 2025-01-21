import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        firstName: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        position: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        password: {
            type: String,
            required: [true, "Password is required"]
        },
    }, 
    {timestamps: true}
)


userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})


userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}


// ading method for generate token
userSchema.methods.generateToken = function(){
    return jwt.sign(
        {
            _id: this.id,
            email: this.email,
        },
        process.env.TOKEN_SECRET,
        {
            expiresIn: process.env.TOKEN_EXPIRY
        }
    )
}


export const User =  mongoose.model("User", userSchema)
