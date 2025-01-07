import React, { useEffect } from "react";
import { fetchAppointmentsByPatient } from "../slices/appointmentSlice";
import { useDispatch, useSelector } from "react-redux";
import { getPatient } from "../slices/patientSlice";
import "../styles/appointments.css"; // Подключение файла стилей

const Appointments = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const id = useSelector((state) => state.patient.id);
  const appointments = useSelector((state) => state.appointment.appointments);

  useEffect(() => {
    console.log("Загрузка списка приемов");
    dispatch(getPatient([token]));
  }, []);

  useEffect(() => {
    if (id) {
      dispatch(fetchAppointmentsByPatient([id, token]));
    }
  }, [id]);

  return (
    <div className="appointments-container">
      <h2>Приемы</h2>
      <ul className="appointments-list">
        {appointments.map((appointment) => (
          <li key={appointment.id} className="appointment-item">
            <p><strong>Дата:</strong> {appointment.appointmentDate}</p>
            <div className="doctor-details">
              <p><strong>Врач:</strong></p>
              <p><strong>Имя:</strong> {appointment.doctor.name}</p>
              <p><strong>Специализация:</strong> {appointment.doctor.specialisation}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Appointments;
