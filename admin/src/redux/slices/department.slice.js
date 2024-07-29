import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_API } from "../../utils/util";

// Create Thunks
export const createDepartment = createAsyncThunk(
    "createDepartment",
    async (data, thunkAPI) => {
        try {
            const response = await axios.post(`${BASE_API}department`, data);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getAllDepartment = createAsyncThunk(
    "getAllDepartment",
    async (cid, thunkAPI) => {
        try {
            const response = await axios.get(`${BASE_API}departments/${cid}`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getDepartmentByID = createAsyncThunk(
    "getDepartmentByID",
    async (id, thunkAPI) => {
        try {
            const response = await axios.get(`${BASE_API}departments/getbyId/${id}`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateDepartmentByID = createAsyncThunk(
    "updateDepartmentByID",
    async ({ id, data }, thunkAPI) => {
        try {
            const response = await axios.put(`${BASE_API}departments/update/${id}`, data);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteDepartmentByID = createAsyncThunk(
    "deleteDepartmentByID",
    async (id, thunkAPI) => {
        try {
            const response = await axios.delete(`${BASE_API}departments/delete/${id}`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);


// Slice
export const departmentSlice = createSlice({
    name: "departmentSlice",
    initialState: {
        departmentInfo: [],
        singleDepartment: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearSingleDepartment: (state) => {
            state.singleDepartment = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createDepartment.pending, (state) => {
                state.loading = true;
            })
            .addCase(createDepartment.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(createDepartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(getAllDepartment.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllDepartment.fulfilled, (state, action) => {
                state.loading = false;
                state.departmentInfo = action.payload
            })
            .addCase(getAllDepartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(getDepartmentByID.pending, (state) => {
                state.loading = true;
            })
            .addCase(getDepartmentByID.fulfilled, (state, action) => {
                state.loading = false;
                state.singleDepartment = action.payload
            })
            .addCase(getDepartmentByID.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
        builder
            .addCase(updateDepartmentByID.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateDepartmentByID.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(updateDepartmentByID.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
        builder
            .addCase(deleteDepartmentByID.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteDepartmentByID.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(deleteDepartmentByID.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});
export const { clearSingleDepartment } = departmentSlice.actions;

export default departmentSlice.reducer;
