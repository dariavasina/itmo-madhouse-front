import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../config';

export const addTreatment = createAsyncThunk('treatments/addTreatment', async (args, { rejectWithValue }) => {
    const getHeaders = {
        headers: {
            'Authorization': 'Bearer ' + args[1],
            'Content-Type': 'application/json; charset=utf-8'
        }
    }
    try{
        console.log("in add treatment");
        console.log(args[0]);
        console.log(args[1]);
        const response = await axios.post(`${API_URL}/api/treatment`, args[0], getHeaders);
        console.log("response")
        return await response.data;
    } catch (error) {
        throw rejectWithValue(error.response?.data?.message || error.message || 'Произошла ошибка');
    }
}
);

const initialState = {
    treatments: [],
    loading: false,
    error: null,
    treatment: null,
};

const treatmentSlice = createSlice({
    name: 'treatments',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addTreatment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addTreatment.fulfilled, (state, action) => {
                state.loading = false;
                state.treatments.push(action.payload);
                state.treatment = action.payload;
            })
            .addCase(addTreatment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
        }
    });

export default treatmentSlice.reducer;