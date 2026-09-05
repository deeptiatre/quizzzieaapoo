const express = require('express');
const UserModal = require('../modals/user.modal');
const jwt = require('jsonwebtoken');
const registerController = async (req, res) => {
    try {


        let { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "name , email and password are required"
            })
        }

        const existinguser = await UserModal.findOne({ email });
        if (existinguser) {
            return res.status(400).json({
                message: "user already exists"
            })
        }


        const newuser = await UserModal.create({
            name,
            email,
            password,
            role
        })



        let token = jwt.sign({ userId: newuser._id, role: newuser.role }, process.env.JWT_SECRET, { expiresIn: '1d' })
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
        if (!token) {
            return res.status(500).json({
                message: "error in token generation"
            })
        }

        return res.status(201).json({
            message: "user registered successfully",
            user: newuser
        })
    } catch (error) {
        console.log("error in register controller", error);
        return res.status(500).json({
            message: "internal server error",
            error: error.message
        })
    }
}

const loginController = async (req, res) => {
    try {

        let { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "email and password are required"
            })
        }

        const user = await UserModal.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "user does not exist"
            })
        }

        const isPasswordMatched = await user.comparePass(password);
        if (!isPasswordMatched) {
            return res.status(400).json({
                message: "invalid credentials"
            })
        }
        let token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' })
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
        if (!token) {
            return res.status(500).json({
                message: "error in token generation"
            })
        }

        return res.status(200).json({
            message: "login successful",
            user: user
        })
    } catch (error) {
        console.log("error in login controller", error);
        return res.status(500).json({
            message: "internal server error",
            error: error.message
        })
    }


}

const logoutController = (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({
            message: "logout successful"
        });
    } catch (error) {
        return res.status(500).json({
            message: "internal server error",
            error: error.message
        });
    }
}

module.exports = {
    registerController,
    loginController,
    logoutController
};