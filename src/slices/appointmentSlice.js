import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../config';

const initialState = {
    appointments: [],
    loading: false,
    error: null,
    unavailableSlots: [],
};

export const fetchAppointmentsByPatient = createAsyncThunk('appointments/fetchAppointmentsByPatient', async (args) => {
    const getHeaders = {
        headers: {
            'Authorization': 'Bearer ' + args[1],
            'Content-Type': 'application/json; charset=utf-8'
        }
    }
    console.log("in fetchAppointmentsByPatient")
    console.log(args[0], getHeaders);
    const response = await axios.get(`${API_URL}/api/appointments/patient/${args[0]}`, getHeaders);
    if (response.status !== 200) {
        throw new Error('Failed to fetch appointments');
    }
    console.log(response.data);
    return await response.data;
});

export const fetchUnavailableSlots = createAsyncThunk('appointments/fetchUnavailableSlots', async ({ doctorId, dateFrom, dateTo, token }, { rejectWithValue }) => {
        try {
            const getHeaders = {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json; charset=utf-8',
                },
            };
            const response = await axios.get(`${API_URL}/api/appointments/doctor/${doctorId}/filter`,
                {
                    ...getHeaders,
                    params: {
                        dateFrom,
                        dateTo,
                    },
                }
            );
            
            console.log("response", response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue('Ошибка при получении доступных временных слотов');
        }
    }
);

export const addAppointment = createAsyncThunk(
    'appointments/addAppointment',
    async ({ patientId, doctorId, appointmentDate, status, notes, token }, { rejectWithValue }) => {
        console.log({
            patient: { id: patientId },
            doctor: { id: doctorId },
            appointmentDate,
            status,
            notes,
        })
        try {
            const response = await axios.post(
                `${API_URL}/api/appointment`,
                {
                    patient: { id: patientId },
                    doctor: { id: doctorId },
                    appointmentDate,
                    status,
                    notes,
                },
                {
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json; charset=utf-8',
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue('Ошибка при записи на прием');
        }
    }
);


const appointmentSlice = createSlice({
    name: 'appointments',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAppointmentsByPatient.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAppointmentsByPatient.fulfilled, (state, action) => {
                state.loading = false;
                state.appointments = action.payload;
            })
            .addCase(fetchAppointmentsByPatient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchUnavailableSlots.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUnavailableSlots.fulfilled, (state, action) => {
                state.loading = false;
                state.unavailableSlots = action.payload;
            })
            .addCase(fetchUnavailableSlots.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addAppointment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addAppointment.fulfilled, (state, action) => {
                state.loading = false;
                state.appointments.push(action.payload);
            })
            .addCase(addAppointment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default appointmentSlice.reducer;
