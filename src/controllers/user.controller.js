import {asyncHandler} from "../utils/asyncHandler.js"
import{ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"

const generateTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateToken()

        return accessToken;

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating token");
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // console.log("Request Body:", req.body);

    if (!req.body) {
        throw new ApiError(400, "Request body is missing");
    }

    const { email, firstName, lastName, password, position } = req.body;

    if (
        [email, firstName, lastName, password, position].some((field) => !field?.trim())
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({ email });

    if (existedUser) {
        throw new ApiError(409, "User with email already exists");
    }

    const user = await User.create({
        email,
        firstName,
        lastName,
        position,
        password,
    });

    const createdUser = await User.findById(user._id).select("-password");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    );
});


const loginUser = asyncHandler(async (req,res) => {

    const {email, password} = req.body

    if (!email) {
        throw new Error(400, " email is required");
    }

    if (!password) {
        throw new Error(400, " password is required");
    }

    // console.log("Request Body:", req.body);
    // console.log("Email:", email);

    const user = await User.findOne({email})

    if (!user) {
        throw new ApiError(404, "user does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "password incorrect");
    }

    const Token = await generateTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, Token
            },
            "User logged In successfully"
        )
    )

})

export {
    registerUser,
    loginUser
}