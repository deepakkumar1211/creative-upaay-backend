import {asyncHandler} from "../utils/asyncHandler.js"
import{ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"


const registerUser = asyncHandler(async (req, res) => {
    console.log("Request Body:", req.body);

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


export {
    registerUser,

}