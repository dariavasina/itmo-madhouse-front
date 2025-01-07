import {combineReducers, configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userSlice from "./slices/userSlice";
import storage from 'redux-persist/lib/storage';
import patientSlice from "./slices/patientSlice";
import doctorSlice from "./slices/doctorSlice";
import appointmentSlice from "./slices/appointmentSlice";
import {persistReducer,
    persistStore,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,} from "redux-persist";

import errorMiddleware from "./errorMiddleware"

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth'],
};

const rootReducer = combineReducers({
    auth: authReducer,
    user: userSlice,
    patient: patientSlice,
    doctor: doctorSlice,
    appointment: appointmentSlice,
})


const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(errorMiddleware),
})

export const persistor = persistStore(store)
export default store