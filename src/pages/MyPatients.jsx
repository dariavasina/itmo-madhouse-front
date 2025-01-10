import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPatients } from "../slices/patientSlice";
import { getDoctor } from "../slices/doctorSlice";
import { addAppointment, fetchUnavailableSlots } from "../slices/appointmentSlice";
import "../styles/myPatients.css";

const MyPatients = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const doctorId = useSelector((state) => state.doctor.id);
  const patients = useSelector((state) => state.patient.patients);
  const [notification, setNotification] = useState(null); // Для уведомлений
  const filteredPatients = patients.filter(
    (patient) => patient.doctor.id === doctorId
  );

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState(""); // Store the selected date
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [unavailableSlots, setUnavailableSlots] = useState([]);

  useEffect(() => {
    dispatch(getDoctor([token]));
    dispatch(fetchPatients([token]));
  }, [dispatch, token]);

  useEffect(() => {
    if (doctorId) {
      const dateFrom = new Date().toISOString();
      const dateTo = new Date(new Date().setDate(new Date().getDate() + 14)).toISOString();
      dispatch(fetchUnavailableSlots({ doctorId, dateFrom, dateTo, token }))
        .then((response) => {
          setUnavailableSlots(response.payload);
        });
    }
  }, [doctorId, token, dispatch]);

  const generateSlots = (date) => {
    const slots = [];
    for (let hour = 8; hour <= 16; hour++) {
      const slot = new Date(date);
      slot.setHours(hour, 0, 0, 0);
      slots.push(slot);
    }
    return slots;
  };

  const getAvailableSlots = (selectedDate) => {
    if (!selectedDate) return []; // If no date is selected, return an empty array

    const slots = generateSlots(selectedDate);
    return slots.filter((slot) =>
      !unavailableSlots.some(
        (unavailableSlot) =>
          new Date(unavailableSlot.appointmentDate).getTime() === slot.getTime()
      )
    );
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000); // Уведомление исчезает через 3 секунды
  };


  const openModal = (patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setAppointmentDate(""); // Reset selected date
  };

  const handleSave = () => {
    if (selectedPatient && appointmentDate) {
      const updatedSlot = new Date(appointmentDate);
      updatedSlot.setHours(updatedSlot.getHours() + 3);
      const appointmentDateISOString = updatedSlot.toISOString();
      dispatch(
        addAppointment({
          patientId: selectedPatient.id,
          doctorId,
          appointmentDate: appointmentDateISOString,
          status: "BOOKED",
          notes: "",
          token,
        })
      )
      .unwrap()
      .then(() => {
        console.log("Диспансеризация успешно назначена.");
        showNotification("Диспансеризация успешно назначена.", "success");
      })
      .catch((error) => {
        showNotification("Ошибка при назначении диспансеризации: " + error, "error");
      });
      closeModal();
    } else {
      showNotification("Выберите пациента и дату для записи на прием.", "error");
    }
  };

  return (
    <div className="my-patients">
      {notification && (
      <div className={`notification ${notification.type}`}>
        {notification.message}
      </div>
    )}
      <h1>Мои пациенты</h1>
      {filteredPatients.length === 0 ? (
        <p>У вас пока нет пациентов.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Имя</th>
              <th>Дата рождения</th>
              <th>Заболевание</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.name}</td>
                <td>{patient.dateOfBirth}</td>
                <td>{patient.disease?.name || "Не выявлено"}</td>
                <td>
                  <button onClick={() => openModal(patient)}>Назначить диспансеризацию</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Выберите дату и время для диспансеризации</h2>
            <input
              type="date"
              value={appointmentDate ? appointmentDate.slice(0, 10) : ""}
              onChange={(e) => setAppointmentDate(e.target.value)} // Handle date selection
              min={new Date().toISOString().slice(0, 10)} // Min date today
              max={new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().slice(0, 10)} // Max date in 2 weeks
            />
            <h3>Доступные временные слоты:</h3>
            <ul>
              {getAvailableSlots(appointmentDate).map((slot) => (
                <li
                  key={slot.getTime()}
                  onClick={() => setAppointmentDate(slot.toISOString())}
                  className={`slot-item ${appointmentDate === slot.toISOString() ? 'selected' : ''}`}
                >
                  {slot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </li>
              ))}
            </ul>
            <div>
              <button onClick={closeModal}>Отмена</button>
              <button onClick={handleSave}>Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPatients;
