import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../config';

const initialState = {
    isAuthenticated: false,
    token: null,
    login: null,
    loading: false,
    error: null,
    isRegistrating: false,
    role: null,
    id: null,
};

export const register = createAsyncThunk('auth/register', async (userDto, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userDto, {
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
        });
        if (response.status === 201) {
            return response.data;
        }
    } catch (error) {
        return rejectWithValue("Этот пароль уже занят, попробуйте другой");
    }
});



export const login = createAsyncThunk('auth/login', async (authDto, {rejectWithValue}) => {
    const headers = {
        'Content-Type': 'application/json; charset=utf-8'
    }
    try {
        const response = await axios.post(`${API_URL}/login`, authDto, {headers});
        return response.data;
    } catch (error) {
        console.log("before")
        console.log(error)
        if (error.response.status === 401) {
            return rejectWithValue(`Неверный логин или пароль`);
        } else if (error.response.status === 403) {
            console.log("403")
            return rejectWithValue(`"Этот пароль уже занят, попробуйте другой"`);
        } else if (error.response.status !== 200) {
            return rejectWithValue(`Прозошла ошибка при входе`);
        }
        throw rejectWithValue(error.response?.data?.message || error.message || 'Произошла ошибка');
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.login = null;
            state.isRegistrating = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.login = action.payload.login
                state.isAuthenticated = true;
                state.isRegistrating = true;
                state.role = action.payload.role;
                state.id = action.payload.id;
                console.log('User is authenticated:', state.isAuthenticated);
                console.log('User is registrating:', state.isRegistrating);
                console.log('Token:', state.token);
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                // state.error = action.error.message;
                console.log(action.error)
            })
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.login = action.payload.login
                state.token = action.payload.token;
                state.role = action.payload.role;
                state.id = action.payload.id;
                console.log('User is authenticated:', state.isAuthenticated);
                console.log(action.payload);
                console.log(state.id);

                console.log('Token:', state.token);
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                // state.error = action.error.message;
                state.error = action.payload;
                action.error = action.payload
            });   
    },
});

export const {logout} = authSlice.actions;
export default authSlice.reducer;