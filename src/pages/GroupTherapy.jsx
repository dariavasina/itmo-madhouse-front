import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPatient } from "../slices/patientSlice"; // импортируем getPatient
import "../styles/groupTherapy.css";

const GroupTherapy = () => {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);

    const patient = useSelector((state) => state.patient.patient);
    
    useEffect(() => {
        dispatch(getPatient([token]));
    }, [dispatch, token]);

    useEffect(() => {
        if (patient) {
            console.log(patient);
        }
    }, [patient]);

    return (
        <div className="group-therapy-container">
            <h2>Групповая терапия</h2>
            {patient?.patientGroup ? (
                <div className="patient-info">
                    <p><strong>Врач группы:</strong> {patient.patientGroup.doctor.name}</p>
                    <p><strong>Специализация:</strong> {patient.patientGroup.doctor.specialisation}</p>
                </div>
            ) : (
                <p className="no-therapy-message">Групповая терапия еще не назначена.</p>
            )}
        </div>
    );
};

export default GroupTherapy;
