import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";
import {API_URL} from "../config";


export const fetchUsers = createAsyncThunk('user/fetchUsers', async (token) => {
    const getHeaders = {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    };
    const response = await axios.get(`${API_URL}/users`, getHeaders);
    if (response.status !== 200) {
        throw new Error('Failed to fetch users');
    }
    return response.data;
});

const userSlice = createSlice({
    name: 'user',
    initialState: {
        users: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default userSlice.reducer;