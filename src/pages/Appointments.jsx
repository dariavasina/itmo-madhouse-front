import React, { useEffect, useState } from "react";
import { fetchAppointmentsByPatient, removeAppointmentById } from "../slices/appointmentSlice";
import { useDispatch, useSelector } from "react-redux";
import { getPatient } from "../slices/patientSlice";
import "../styles/appointments.css";

const Appointments = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const id = useSelector((state) => state.patient.id);
  const appointments = useSelector((state) => state.appointment.appointments);
  const [currentAppointments, setCurrentAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("current");
  const [showModal, setShowModal] = useState(false); // Для модального окна
  const [appointmentToDelete, setAppointmentToDelete] = useState(null); // ID записи для удаления

  useEffect(() => {
    dispatch(getPatient([token]));
  }, [dispatch, token]);

  useEffect(() => {
    if (id) {
      dispatch(fetchAppointmentsByPatient([id, token]));
    }
  }, [dispatch, id, token]);

  useEffect(() => {
    const now = new Date();
    const current = [];
    const past = [];

    appointments.forEach((appointment) => {
      const appointmentDate = new Date(appointment.appointmentDate);
      if (appointmentDate > now) {
        current.push(appointment);
      } else {
        past.push(appointment);
      }
    });

    setCurrentAppointments(current);
    setPastAppointments(past);
  }, [appointments]);

  const handleDelete = async () => {
    try {
      if (appointmentToDelete) {
        await dispatch(removeAppointmentById([appointmentToDelete, token]));
        dispatch(fetchAppointmentsByPatient([id, token]));
        setShowModal(false);
        setAppointmentToDelete(null);
      }
    } catch (error) {
      console.error("Ошибка при удалении записи:", error);
    }
  };

  const openModal = (appointmentId) => {
    setAppointmentToDelete(appointmentId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setAppointmentToDelete(null);
  };

  const renderAppointments = (list, isCurrent) =>
    list.map((appointment) => (
      <li key={appointment.id} className="appointment-item">
        <p><strong>Дата:</strong> {appointment.appointmentDate}</p>
        <div className="doctor-details">
          <p><strong>Врач:</strong></p>
          <p><strong>Имя:</strong> {appointment.doctor.name}</p>
          <p><strong>Специализация:</strong> {appointment.doctor.specialisation}</p>
        </div>
        {isCurrent && (
          <button
            className="delete-button"
            onClick={() => openModal(appointment.id)}
          >
            Удалить
          </button>
        )}
      </li>
    ));

  return (
    <div className="appointments-container">
      <h2>Приемы</h2>
      <div className="tabs">
        <button
          className={activeTab === "current" ? "active" : ""}
          onClick={() => setActiveTab("current")}
        >
          Текущие записи
        </button>
        <button
          className={activeTab === "past" ? "active" : ""}
          onClick={() => setActiveTab("past")}
        >
          Прошедшие записи
        </button>
      </div>
      <ul className="appointments-list">
        {activeTab === "current"
          ? renderAppointments(currentAppointments, true)
          : renderAppointments(pastAppointments, false)}
      </ul>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p>Вы уверены, что хотите удалить эту запись?</p>
            <div className="modal-actions">
              <button className="confirm-button" onClick={handleDelete}>
                Да, удалить
              </button>
              <button className="cancel-button" onClick={closeModal}>
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
