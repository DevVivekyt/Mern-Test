const Department = require("../models/department.model");
const MESSAGES = require("../utils/messages.utils");
const Users = require("../models/user.model");
const { createErrorResponse, createSuccessResponse } = require("../utils/response.utils");

const createDepatment = async (req, res) => {
    const ObjReq = req.body;

    try {
        const existingDepartment = await Department.findOne({ departmentName: ObjReq.departmentName, companyId: ObjReq.companyId, isDeleted: false });
        if (existingDepartment) {
            return res.json(createErrorResponse(MESSAGES.ALREADY_EXISTS));
        }

        const newDepartment = await Department.create(ObjReq);

        return res.json(createSuccessResponse(MESSAGES.CREATED_SUCCESS, newDepartment));
    } catch (error) {
        return res.json(createErrorResponse(MESSAGES.EXCEPTION + error.message));
    }
};

const GetAllDepatment = async (req, res) => {
    const { cid } = req.params;
    try {
        const allDepartment = await Department.find({ companyId: cid, isDeleted: false });

        if (allDepartment.length === 0) {
            return res.json(createErrorResponse(MESSAGES.NO_RECORD_FOUND));
        }

        const allUsers = await Users.find({ companyId: cid, isDeleted: false });

        const userMap = new Map();
        allUsers.forEach(user => {
            userMap.set(user._id.toString(), user.fullName);
        });

        const departmentsWithEmployeeNames = allDepartment.map(department => {
            return {
                ...department.toObject(),
                assignedEmployeeName: userMap.get(department.assignedUserid?.toString()) || 'Unknown'
            };
        });

        return res.json(createSuccessResponse(MESSAGES.FETCHED_SUCCESS, departmentsWithEmployeeNames));

    } catch (error) {
        return res.json(createErrorResponse(MESSAGES.EXCEPTION + error.message));
    }
};

const GetDepatmentById = async (req, res) => {
    const { id } = req.params
    try {
        const department = await Department.findById({ _id: id, isDeleted: false });
        if (!department) {
            return res.json(createErrorResponse(MESSAGES.NO_RECORD_FOUND));
        } else {
            return res.json(createSuccessResponse(MESSAGES.FETCHED_SUCCESS, department));
        }

    } catch (error) {
        return res.json(createErrorResponse(MESSAGES.EXCEPTION + error.message));
    }
};

const deleteDepartment = async (req, res) => {
    const { id } = req.params;

    try {
        const department = await Department.findOne({ _id: id, isDeleted: false });

        if (!department) {
            return res.json(createErrorResponse(MESSAGES.NO_RECORD_FOUND));
        }

        department.isDeleted = true;
        await department.save();

        return res.json(createSuccessResponse(MESSAGES.DELETED_SUCCESS, department));
    } catch (error) {
        return res.json(createErrorResponse(MESSAGES.EXCEPTION, error.message));
    }
};

const updateDepartment = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const department = await Department.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { $set: updateData },
            { new: true }
        );

        if (!department) {
            return res.json(createErrorResponse(MESSAGES.NO_RECORD_FOUND));
        }

        return res.json(createSuccessResponse(MESSAGES.UPDATED_SUCCESS, department));
    } catch (error) {
        console.error(`Error updating department: ${error.message}`);
        return res.status(500).json(createErrorResponse(MESSAGES.EXCEPTION, error.message));
    }
};

module.exports = { createDepatment, GetAllDepatment, GetDepatmentById, deleteDepartment, updateDepartment }