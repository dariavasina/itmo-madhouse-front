import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../config';


export const fetchPatients = createAsyncThunk('patients/fetchPatients', async (args) => {
    const getHeaders = {
        headers: {
            'Authorization': 'Bearer ' + args[1],
            'Content-Type': 'application/json; charset=utf-8'
        }
    }
    const response = await axios.get(`${API_URL}/api/patients`, getHeaders);
    if (response.status !== 200) {
        throw new Error('Failed to fetch patients');
    }
    console.log(response.data);
    return await response.data;
});

export const getPatient = createAsyncThunk('patients/getPatient', async (args, { rejectWithValue }) => {
    const getHeaders = {
        headers: {
            'Authorization': 'Bearer ' + args[0],
            'Content-Type': 'application/json; charset=utf-8'
        }
    }
    try {
        const response = await axios.get(`${API_URL}/api/patient/me`, getHeaders);
        return await response.data;
    } catch (error) {
        if (error.response.status === 404) {
            return rejectWithValue(`Пациент не найден`);
        }
        throw rejectWithValue(error.response?.data?.message || error.message || 'Произошла ошибка');
    }
});


export const addPatient = createAsyncThunk('patients/addPatient', async (args, { rejectWithValue }) => {
    const getHeaders = {
        headers: {
            'Authorization': 'Bearer ' + args[1],
            'Content-Type': 'application/json; charset=utf-8'
        }
    }
    try{
        console.log(args[0]);
        console.log(args[1]);
        const response = await axios.post(`${API_URL}/api/patient`, args[0], getHeaders);
        console.log("response")
        return await response.data;
    } catch (error) {
        const regex = /model\.(\w+)/;
        const match = error.response.data.match(regex);
        if (error.response.status === 500 && error.response.data.includes("null id") && match && match[1]) {
            const modelName = match[1]
            return rejectWithValue(`Билет с таким ${modelName} уже существует. Невозможно создать`);
        }
        throw rejectWithValue(error.response?.data?.message || error.message || 'Произошла ошибка');
    }
}
);

export const updatePatient = createAsyncThunk('patients/updatePatient', async (args, { rejectWithValue }) => {
    const getHeaders = {
        headers: {
            'Authorization': 'Bearer ' + args[1],
            'Content-Type': 'application/json; charset=utf-8'
        }
    }
    try {
        const response = await axios.put(`${API_URL}/api/patient`, args[0], getHeaders);
        return await response.data;

    } catch (error) {
        if (error.response.status === 403) {
            return rejectWithValue(`Пациент вам не принадлежит. Невозможно изменить`);
        }
    }
});

export const deletePatient = createAsyncThunk('patients/deletePatient', async (args, { rejectWithValue }) => {
    const getHeaders = {
        headers: {
            'Authorization': 'Bearer ' + args[1],
            'Content-Type': 'application/json; charset=utf-8'
        }
    }
    try{
        const response = await axios.delete(`${API_URL}/patient/${args[0]}`, getHeaders);
        return await response.data;
    } catch (error) {
        if (error.response.status === 403) {
            return rejectWithValue(`Пациент вам не принадлежит. Невозможно удалить`);
        }
    }
});

const initialState = {
    patients: [],
    loading: false,
    error: null,
    patient: null,
    id: null,
};

const patientSlice = createSlice({
    name: 'patients',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPatients.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPatients.fulfilled, (state, action) => {
                state.loading = false;
                state.patients = action.payload;
            })
            .addCase(fetchPatients.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addPatient.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addPatient.fulfilled, (state, action) => {
                state.loading = false;
                state.patients.push(action.payload);
                state.id = action.payload.id;
            })
            .addCase(addPatient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updatePatient.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePatient.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.patients.findIndex(
                    (patient) => patient.id === action.payload.id
                );
                if (index !== -1) {
                    state.patients[index] = action.payload;
                }
            })
            .addCase(updatePatient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deletePatient.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePatient.fulfilled, (state, action) => {
                state.loading = false;
                state.patients = state.patients.filter(
                    (patient) => patient.id !== action.payload
                );
            })
            .addCase(deletePatient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getPatient.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPatient.fulfilled, (state, action) => {
                state.loading = false;
                state.patient = action.payload; 
                console.log("in getPatient", action.payload);
                state.id =  action.payload.id;
            })
            .addCase(getPatient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default patientSlice.reducer;
