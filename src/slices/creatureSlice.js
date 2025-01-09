import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../config';

const initialState = {
    creatures: [],
    loading: false,
    error: null,
};

export const fetchCreatures = createAsyncThunk('creatures/fetchCreatures', async (args) => {
    const getHeaders = {
        headers: {
            'Authorization': 'Bearer ' + args[0]
        }
    }

    console.log(getHeaders);
    const response = await axios.get(`${API_URL}/api/creatures`, getHeaders);
    if (response.status !== 200) {
        throw new Error('Failed to fetch creatures');
    }
    console.log(response.data);
    return await response.data;
});

const creatureSlice = createSlice({
    name: 'creatures',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCreatures.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCreatures.fulfilled, (state, action) => {
                state.loading = false;
                state.creatures = action.payload;
            })
            .addCase(fetchCreatures.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
        },
    });
    
export default creatureSlice.reducer;