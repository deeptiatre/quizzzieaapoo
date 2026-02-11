const express = require('express');
const UserModal = require('../modals/user.modal');
const jwt = require('jsonwebtoken');
const authmiddleware = async (req, res, next) => {

    try {

        const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);

        if (!token) {
            return res.status(401).json({
                message: "unauthorized , no token found"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModal.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({
                message: "unauthorized , user not found"
            })
        }

        req.user = user;

        next();
    } catch (error) {
        console.error("Error in auth middleware:", error);
        return res.status(401).json({
            message: "unauthorized , invalid token",
            error: error.message
        })
    }
}

module.exports = authmiddleware;