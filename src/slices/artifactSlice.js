import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../config';

const initialState = {
    artifacts: [],
    loading: false,
    error: null,
};

export const fetchArtifacts = createAsyncThunk('artifacts/fetchArtifacts', async (args) => {
    const getHeaders = {
        headers: {
            'Authorization': 'Bearer ' + args[0]
        }
    }

    console.log(getHeaders);
    const response = await axios.get(`${API_URL}/api/artifacts`, getHeaders);
    if (response.status !== 200) {
        throw new Error('Failed to fetch artifacts');
    }
    console.log(response.data);
    return await response.data;
});

const artifactSlice = createSlice({
    name: 'artifacts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchArtifacts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchArtifacts.fulfilled, (state, action) => {
                state.loading = false;
                state.artifacts = action.payload;
            })
            .addCase(fetchArtifacts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
        },
    });
    
export default artifactSlice.reducer;