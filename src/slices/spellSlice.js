import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../config';

const initialState = {
    spells: [],
    loading: false,
    error: null,
};

export const fetchSpells = createAsyncThunk('spells/fetchSpells', async (args) => {
    const getHeaders = {
        headers: {
            'Authorization': 'Bearer ' + args[0]
        }
    }

    console.log(getHeaders);
    const response = await axios.get(`${API_URL}/api/spells`, getHeaders);
    if (response.status !== 200) {
        throw new Error('Failed to fetch spells');
    }
    console.log(response.data);
    return await response.data;
});

const spellSlice = createSlice({
    name: 'spells',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSpells.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSpells.fulfilled, (state, action) => {
                state.loading = false;
                state.spells = action.payload;
            })
            .addCase(fetchSpells.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
        },
    });
    
export default spellSlice.reducer;