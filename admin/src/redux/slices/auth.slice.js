import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_API } from "../../utils/util";

// Create Thunks
export const register = createAsyncThunk(
    "register",
    async (data, thunkAPI) => {
        try {
            const response = await axios.post(`${BASE_API}auth/registration`, data);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const loginApi = createAsyncThunk(
    "loginApi",
    async (data, thunkAPI) => {
        try {
            const response = await axios.post(`${BASE_API}/auth/login`, data);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Slice
export const authSlice = createSlice({
    name: "authSlice",
    initialState: {
        userInfo: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.loading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(loginApi.pending, (state) => {
                state.loading = true;
            })
            .addCase(loginApi.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(loginApi.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default authSlice.reducer;
