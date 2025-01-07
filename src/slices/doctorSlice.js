import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../config';

const initialState = {
    doctors: [],
    loading: false,
    error: null,
};

export const fetchDoctors = createAsyncThunk('doctors/fetchDoctors', async (args) => {
    const getHeaders = {
        headers: {
            'Authorization': 'Bearer ' + args[0]
        }
    }

    console.log(getHeaders);
    const response = await axios.get(`${API_URL}/api/doctors`, getHeaders);
    if (response.status !== 200) {
        throw new Error('Failed to fetch doctors');
    }
    console.log(response.data);
    return await response.data;
});

export const createPatientGroup = createAsyncThunk('doctors/createPatientGroup', async (args, { rejectWithValue }) => {
    const getHeaders = {
        headers: {
            'Authorization': 'Bearer ' + args[3],
            'Content-Type': 'application/json; charset=utf-8'
        }
    }
    try {
        const response = await axios.post(`${API_URL}/api/doctors/${args[0]}/create-group?specialisation=${args[1]}`, args[2], getHeaders);
        return response.data;
    } catch (error) {
        return rejectWithValue('Ошибка при создании группы пациентов');
    }
});

const doctorSlice = createSlice({
    name: 'doctors',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDoctors.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDoctors.fulfilled, (state, action) => {
                state.loading = false;
                state.doctors = action.payload;
            })
            .addCase(fetchDoctors.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createPatientGroup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPatientGroup.fulfilled, (state, action) => {
                state.loading = false;
                const doctorIndex = state.doctors.findIndex(doctor => doctor.id === action.payload.doctorId);
                if (doctorIndex !== -1) {
                    state.doctors[doctorIndex].patientGroups.push(action.payload);
                }
            })
            .addCase(createPatientGroup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default doctorSlice.reducer;
