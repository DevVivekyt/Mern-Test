const mongoose = require("mongoose");
const { Schema } = mongoose;

const departmentSchema = new Schema(
    {
        companyId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        departmentName: {
            type: String,
            required: true,
        },
        assignedUserid: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            maxlength: 255,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },

    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Department", departmentSchema);
