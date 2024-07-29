const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const Users = require("../models/user.model");
const MESSAGES = require("../utils/messages.utils");
const { createErrorResponse, createSuccessResponse } = require("../utils/response.utils");
const { hashPassword, JWT_SECRET_KEY } = require('../config/config');

// Register
const registration = async (req, res) => {
    let { email, password, fullName, roleID, companyId } = req.body;

    try {
        if (!email || !password || !fullName || !roleID) {
            return res.json(createErrorResponse("Missing required fields"));
        }

        const existingUser = await Users.findOne({ email: email, isDeleted: false });
        if (existingUser) {
            return res.json(createErrorResponse(MESSAGES.USER_ALREADY_EXISTS));
        }

        if (!companyId) {
            companyId = new mongoose.Types.ObjectId()
        }
        const hashedPassword = hashPassword(password);
        const newUser = await Users.create({
            fullName,
            email,
            password: hashedPassword,
            roleID,
            companyId
        });

        return res.json(createSuccessResponse(MESSAGES.CREATED_SUCCESS, newUser));
    } catch (error) {
        return res.json(createErrorResponse(MESSAGES.EXCEPTION + error.message));
    }
};
// user login
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Users.findOne({
            email: email,
            isDeleted: false,
        });

        if (!user) {
            return res.json(createErrorResponse(MESSAGES.NOT_FOUND));
        }

        const hashedPassword = hashPassword(password);

        if (hashedPassword !== user.password) {
            return res.json(createErrorResponse(MESSAGES.INVALID_CREDENTIALS));
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET_KEY,
            { expiresIn: '1d' }
        );

        const data = {
            token,
            companyId: user.companyId,
            userInfo: user
        }

        return res.json(createSuccessResponse(MESSAGES.LOGIN_SUCCESS, data));
    } catch (error) {
        return res.json(createErrorResponse(MESSAGES.EXCEPTION + error.message));
    }
};

module.exports = { registration, login };
