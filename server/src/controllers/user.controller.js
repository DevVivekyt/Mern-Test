const mongoose = require("mongoose");
const Users = require("../models/user.model");
const MESSAGES = require("../utils/messages.utils");
const { createErrorResponse, createSuccessResponse } = require("../utils/response.utils");
const { hashPassword, JWT_SECRET_KEY } = require('../config/config');

// Create users
const createUser = async (req, res) => {
    let { email, password, fullName, roleID, companyId, address } = req.body;

    try {
        if (!email || !password || !fullName || !roleID) {
            return res.json(createErrorResponse("Missing required fields"));
        }

        const existingUser = await Users.findOne({ email: email, companyId: companyId, isDeleted: false });
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
            companyId,
            address
        });

        return res.json(createSuccessResponse(MESSAGES.CREATED_SUCCESS, newUser));
    } catch (error) {
        return res.json(createErrorResponse(MESSAGES.EXCEPTION + error.message));
    }
};

const GetAllUser = async (req, res) => {
    const { cid } = req.params
    try {
        const AllUser = await Users.find({ companyId: cid, isDeleted: false }).sort({ fullName: 1, address: 1 });;
        const filteredUsers = AllUser.filter(user => user.roleID !== 1);
        if (filteredUsers.length > 0) {
            return res.json(createSuccessResponse(MESSAGES.FETCHED_SUCCESS, filteredUsers));
        } else {
            return res.json(createErrorResponse(MESSAGES.NO_RECORD_FOUND));
        }

    } catch (error) {
        return res.json(createErrorResponse(MESSAGES.EXCEPTION + error.message));
    }
};

const GetUserById = async (req, res) => {
    const { id } = req.params
    try {
        const user = await Users.findById({ _id: id, isDeleted: false });
        if (!user) {
            return res.json(createErrorResponse(MESSAGES.NO_RECORD_FOUND));
        } else {
            return res.json(createSuccessResponse(MESSAGES.FETCHED_SUCCESS, user));
        }

    } catch (error) {
        return res.json(createErrorResponse(MESSAGES.EXCEPTION + error.message));
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await Users.findOne({ _id: id, isDeleted: false });

        if (!user) {
            return res.json(createErrorResponse(MESSAGES.NO_RECORD_FOUND));
        }

        user.isDeleted = true;
        await user.save();

        return res.status(200).json(createSuccessResponse(MESSAGES.DELETED_SUCCESS, user));
    } catch (error) {
        return res.json(createErrorResponse(MESSAGES.EXCEPTION, error.message));
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const user = await Users.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { $set: updateData },
            { new: true }
        );

        if (!user) {
            return res.json(createErrorResponse(MESSAGES.NO_RECORD_FOUND));
        }

        return res.json(createSuccessResponse(MESSAGES.UPDATED_SUCCESS, user));
    } catch (error) {
        return res.status(500).json(createErrorResponse(MESSAGES.EXCEPTION, error.message));
    }
};
const GetFiltredUser = async (req, res) => {
    const { cid } = req.params;
    const { search = '' } = req.query;
    try {
        const searchQuery = {
            companyId: cid,
            isDeleted: false,
            $or: [
                { fullName: { $regex: search, $options: 'i' } },
                { address: { $regex: search, $options: 'i' } }
            ],
            roleID: { $ne: 1 }
        };
        const filteredUsers = await Users.find(searchQuery);

        if (filteredUsers.length > 0) {
            return res.json(createSuccessResponse(MESSAGES.FETCHED_SUCCESS, filteredUsers));
        } else {
            return res.json(createErrorResponse(MESSAGES.NO_RECORD_FOUND));
        }

    } catch (error) {
        return res.json(createErrorResponse(MESSAGES.EXCEPTION + error.message));
    }
};





module.exports = { createUser, GetAllUser, GetUserById, deleteUser, updateUser, GetFiltredUser };
