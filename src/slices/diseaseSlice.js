import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../config';

const initialState = {
    diseases: [],
    loading: false,
    error: null,
};

export const fetchDiseases = createAsyncThunk('diseases/fetchDiseases', async (args) => {
    const getHeaders = {
        headers: {
            'Authorization': 'Bearer ' + args[0]
        }
    }

    console.log(getHeaders);
    const response = await axios.get(`${API_URL}/api/diseases`, getHeaders);
    if (response.status !== 200) {
        throw new Error('Failed to fetch diseases');
    }
    console.log(response.data);
    return await response.data;
});

const diseaseSlice = createSlice({
    name: 'diseases',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDiseases.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDiseases.fulfilled, (state, action) => {
                state.loading = false;
                state.diseases = action.payload;
            })
            .addCase(fetchDiseases.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
        },
    });
    
export default diseaseSlice.reducer;