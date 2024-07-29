import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_API } from "../../utils/util";

// Create Thunks
export const createUser = createAsyncThunk(
    "createUser",
    async (data, thunkAPI) => {
        try {
            const response = await axios.post(`${BASE_API}user`, data);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getAllUser = createAsyncThunk(
    "getAllUser",
    async (cid, thunkAPI) => {
        try {
            const response = await axios.get(`${BASE_API}user/${cid}`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getUserById = createAsyncThunk(
    "getUserById",
    async (id, thunkAPI) => {
        try {
            const response = await axios.get(`${BASE_API}user/getbyId/${id}`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateUserById = createAsyncThunk(
    "updateUserById",
    async ({ id, data }, thunkAPI) => {
        try {
            const response = await axios.put(`${BASE_API}user/update/${id}`, data);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getFiltredUser = createAsyncThunk(
    "getFiltredUser",
    async ({ cid, search }, thunkAPI) => {
        try {
            const response = await axios.get(`${BASE_API}user/search/${cid}?search=${search}`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteUserByID = createAsyncThunk(
    "deleteUserByID",
    async (id, thunkAPI) => {
        try {
            const response = await axios.delete(`${BASE_API}user/delete/${id}`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);



// Slice
export const userSlice = createSlice({
    name: "userSlice",
    initialState: {
        userInfo: [],
        singleuserInfo: [],
        filteredInfo: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearSingleUser: (state) => {
            state.singleuserInfo = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(createUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(getAllUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllUser.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload
            })
            .addCase(getAllUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
        builder
            .addCase(getFiltredUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(getFiltredUser.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload
            })
            .addCase(getFiltredUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(getUserById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getUserById.fulfilled, (state, action) => {
                state.loading = false;
                state.singleuserInfo = action.payload
            })
            .addCase(getUserById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
        builder
            .addCase(updateUserById.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateUserById.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(updateUserById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
        builder
            .addCase(deleteUserByID.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteUserByID.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(deleteUserByID.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearSingleUser } = userSlice.actions;


export default userSlice.reducer;
