import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPatient } from "../slices/patientSlice";
import { fetchGroupTherapiesByPatientGroup } from "../slices/patientGroupSlice"; // Добавить action
import "../styles/groupTherapy.css";

const GroupTherapy = () => {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);

    const patient = useSelector((state) => state.patient.patient);
    const groupTherapies = useSelector((state) => state.patientGroup.groupTherapies); // Достаем групповые терапии из state

    // Получение информации о пациенте
    useEffect(() => {
        dispatch(getPatient([token]));
    }, [dispatch, token]);

    // Проверяем наличие группы у пациента и загружаем групповые терапии
    useEffect(() => {
        if (patient?.patientGroup) {
            dispatch(fetchGroupTherapiesByPatientGroup([patient.patientGroup.id, token]));
        }
    }, [dispatch, patient, token]);

    return (
        <div className="group-therapy-container">
            <h2>Групповая терапия</h2>
            {patient?.patientGroup ? (
                <>
                    <div className="patient-info">
                        <p><strong>Врач группы:</strong> {patient.patientGroup.doctor.name}</p>
                        <p><strong>Специализация:</strong> {patient.patientGroup.doctor.specialisation}</p>
                    </div>
                    <h3>Назначенные терапии</h3>
                    {groupTherapies && groupTherapies.length > 0 ? (
                        <ul className="therapy-list">
                            {groupTherapies.map((therapy) => (
                                <li key={therapy.id} className="therapy-item">
                                    <p><strong>ID:</strong> {therapy.id}</p>
                                    <p><strong>Дата:</strong> {therapy.therapyDate}</p>
                                    <p><strong>Артфакт:</strong> {therapy.artifact?.name || "Нет данных"}</p>
                                    <p><strong>Существо:</strong> {therapy.creature?.name || "Нет данных"}</p>
                                    <p><strong>Заклинание:</strong> {therapy.spell?.name || "Нет данных"}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-therapy-message">Терапии для группы не назначены.</p>
                    )}
                </>
            ) : (
                <p className="no-therapy-message">Групповая терапия еще не назначена.</p>
            )}
        </div>
    );
};

export default GroupTherapy;
