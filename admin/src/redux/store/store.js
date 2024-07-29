import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/auth.slice"
import userReducer from "../slices/user.slice"
import departmentReducer from "../slices/department.slice"

export default configureStore({
    reducer: {
        auth: authReducer,
        users: userReducer,
        departments: departmentReducer

    },
});