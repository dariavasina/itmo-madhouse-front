import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../config';

const initialState = {
    patientGroups: [],
    loading: false,
    error: null,
    patientGroup: null,
    groupTherapies: [],
};

export const fetchPatientGroupsByDoctor = createAsyncThunk('patientGroups/fetchPatientGroupsByDoctor', async (args) => {
    const getHeaders = {
        headers: {
            'Authorization': 'Bearer ' + args[1]
        }
    }

    console.log(getHeaders);
    const response = await axios.get(`${API_URL}/api/patient-groups/doctor/${args[0]}`, getHeaders);
    if (response.status !== 200) {
        throw new Error('Failed to fetch patient groups by doctor');
    }
    console.log(response.data);
    return await response.data;
});

export const deletePatientGroup = createAsyncThunk('patientGroups/deletePatientGroup', async (args, { rejectWithValue }) => {
    const getHeaders = {
        headers: {
            'Authorization': 'Bearer ' + args[1],
            'Content-Type': 'application/json; charset=utf-8'
        }
    }
    try{
        console.log(args[0], getHeaders);
        const response = await axios.delete(`${API_URL}/api/patient-group/${args[0]}`, getHeaders);
        return await response.data;
    } catch (error) {
        if (error.response.status === 403) {
            return rejectWithValue(`группа вам не принадлежит. Невозможно удалить`);
        }
    }
});

export const fetchGroupTherapiesByPatientGroup = createAsyncThunk('patientGroups/fetchGroupTherapiesByPatientGroup', async (args) => {
    const getHeaders = {
        headers: {
            'Authorization': 'Bearer ' + args[1]
        }
    }

    console.log(getHeaders);
    const response = await axios.get(`${API_URL}/api/group-therapies/patient-group/${args[0]}`, getHeaders);
    if (response.status !== 200) {
        throw new Error('Failed to fetch group therapies by patient group');
    }
    console.log(response.data);
    return await response.data;
});

export const addGroupTherapy = createAsyncThunk('patientGroups/addGroupTherapy', async (args, { rejectWithValue }) => {
    const getHeaders = {
        headers: {
            'Authorization': 'Bearer ' + args[1],
            'Content-Type': 'application/json; charset=utf-8'
        }
    }
    try{
        const response = await axios.post(`${API_URL}/api/group-therapy`, args[0], getHeaders);
        console.log("response")
        return await response.data;
    } catch (error) {
        throw rejectWithValue(error.response?.data?.message || error.message || 'Произошла ошибка');
    }
}
);


const patientGroupSlice = createSlice({
    name: 'patientGroups',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPatientGroupsByDoctor.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPatientGroupsByDoctor.fulfilled, (state, action) => {
                state.loading = false;
                state.patientGroups = action.payload;
                console.log(action.payload);
            })
            .addCase(fetchPatientGroupsByDoctor.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchGroupTherapiesByPatientGroup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGroupTherapiesByPatientGroup.fulfilled, (state, action) => {
                state.loading = false;
                state.groupTherapies = action.payload;
                console.log(action.payload);
            })
            .addCase(fetchGroupTherapiesByPatientGroup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deletePatientGroup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePatientGroup.fulfilled, (state, action) => {
                state.loading = false;
                state.patientGroups = state.patientGroups.filter(
                    (patientGroup) => patientGroup.id !== action.payload
                );
            })
            .addCase(deletePatientGroup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addGroupTherapy.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addGroupTherapy.fulfilled, (state, action) => {
                state.loading = false;
                state.groupTherapies.push(action.payload);
            })
            .addCase(addGroupTherapy.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
            
    },
});

export default patientGroupSlice.reducer;
