const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
    {
        companyId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        roleID: {
            type: Number,
            required: true,
        },
        address: {
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

module.exports = mongoose.model("User", userSchema);
