import React, { useEffect, useState } from "react";
import { fetchAppointmentsByDoctor, updateAppointment } from "../slices/appointmentSlice";
import { useDispatch, useSelector } from "react-redux";
import { getDoctor } from "../slices/doctorSlice";
import "../styles/appointments.css"; // Подключение файла стилей
import { fetchSpells } from "../slices/spellSlice";
import { fetchCreatures } from "../slices/creatureSlice";
import { fetchArtifacts } from "../slices/artifactSlice";
import { fetchDiseases } from "../slices/diseaseSlice";
import { addTreatment } from "../slices/treatmentSlice";
import { updatePatient } from "../slices/patientSlice";
import { removeAppointmentById } from "../slices/appointmentSlice";
import { fetchPatientGroupsByDoctor } from "../slices/patientGroupSlice";

const DoctorAppointments = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const id = useSelector((state) => state.doctor.id);
  const spells = useSelector((state) => state.spell.spells);
  const creatures = useSelector((state) => state.creature.creatures);
  const artifacts = useSelector((state) => state.artifact.artifacts);
  const diseases = useSelector((state) => state.disease.diseases);
  const appointments = useSelector((state) => state.appointment.appointments);
  const [currentAppointments, setCurrentAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("current");
  const [showModal, setShowModal] = useState(false); 
  const [showModalToDelete, setShowModalToDelete] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null); // ID записи для удаления
  const [appointmentToEdit, setAppointmentToEdit] = useState(null); 
  const [formData, setFormData] = useState({
    diagnosis: "",
    status: "",
    notes: "",
    treatmentArtifact: "",
    magicalCreature: "",
    spell: "",
    treatmentDate: "",
  });
  const [treatmentAssigned, setTreatmentAssigned] = useState(false); 

  useEffect(() => {
    console.log("Загрузка списка приемов");
    dispatch(getDoctor([token]));
    dispatch(fetchSpells([token]));
    dispatch(fetchCreatures([token]));
    dispatch(fetchArtifacts([token]));
    dispatch(fetchDiseases([token]));
  }, []);

  useEffect(() => {
    if (id) {
      dispatch(fetchAppointmentsByDoctor([id, token]));
    }
  }, [id]);

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

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    console.log("Форма отправлена с данными:", formData);

    if (!token) {
        console.error("Токен отсутствует");
        return;
    }

    const appointment = appointments.find(app => app.id === appointmentToEdit);
    if (!appointment) {
        console.error("Не удалось найти запись на прием с ID:", appointmentToEdit);
        return;
    }

    try {
        // 1. Обновление пациента
        const patientUpdate = {
            ...appointment.patient,
            disease: formData.diagnosis ? { name: formData.diagnosis } : appointment.patient.disease,
        };

        await dispatch(updatePatient([patientUpdate.id, patientUpdate, token])).unwrap();
        console.log("Пациент успешно обновлен:", patientUpdate);

        // 2. Обновление записи приема, если есть данные для обновления
        if (formData.status || formData.notes) {
            const existingAppointment = appointments.find(a => a.id === appointmentToEdit);
            if (!existingAppointment) {
                console.error ("Запись приема не найдена!");
                return;
            }
            // Создаем полный объект для обновления
            const appointmentUpdate = {
                ...existingAppointment, // Берем все текущие поля
                status: formData.status || existingAppointment.status,
                notes: formData.notes || existingAppointment.notes,
            };
           
            await dispatch(updateAppointment([appointmentUpdate.id, appointmentUpdate, token])).unwrap();
            console.log("Запись приема успешно обновлена:", appointmentUpdate);
        }

        // 3. Добавление лечения, если введены данные
        if (
            formData.treatmentArtifact ||
            formData.magicalCreature ||
            formData.spell ||
            formData.treatmentDate
        ) {
            const treatment = {
                patient: appointment.patient,
                doctor: appointment.doctor, // Передаем объект врача
                artifact: formData.treatmentArtifact ? { id: formData.treatmentArtifact } : null,
                creature: formData.magicalCreature ? { id: formData.magicalCreature } : null,
                spell: formData.spell ? { id: formData.spell } : null,
                treatmentDate: formData.treatmentDate,
                updatedAt: new Date().toISOString(),
            };

            await dispatch(addTreatment([treatment, token])).unwrap();
            console.log("Лечение успешно добавлено:", treatment);
        }

        // Закрыть модальное окно после завершения всех запросов
        setShowModal(false);
    } catch (error) {
        console.error("Ошибка при выполнении запросов:", error);
    }
};

  

  const openModal = (appointmentId) => {
    setAppointmentToEdit(appointmentId);
    setShowModal(true);
  };

  const openModalToDelete = (appointmentId) => {
    setAppointmentToDelete(appointmentId);
    setShowModalToDelete(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setAppointmentToEdit(null);
  };

  const closeModalToDelete = () => {
    setShowModalToDelete(false);
    setAppointmentToDelete(null);
  };

  const handleDelete = async () => {
    try {
      if (appointmentToDelete) {
        await dispatch(removeAppointmentById([appointmentToDelete, token]));
        dispatch(fetchAppointmentsByDoctor([id, token]));
        setShowModalToDelete(false);
        setAppointmentToDelete(null);
      }
    } catch (error) {
      console.error("Ошибка при удалении записи:", error);
    }
  };

  const renderAppointments = (list, isCurrent) =>
    list.map((appointment) => (
      <li key={appointment.id} className="appointment-item">
        <p><strong>Дата:</strong> {appointment.appointmentDate}</p>
        <div className="doctor-details">
          <p><strong>Пациент:</strong></p>
          <p><strong>Имя:</strong> {appointment.patient.name}</p>
          <p><strong>Дата рождения:</strong> {appointment.patient.dateOfBirth}</p>
          <p><strong>Заболевание:</strong> {appointment.patient.disease?.name || "Не указано"}</p>

        </div>
        {isCurrent && (
          <button
            className="delete-button"
            onClick={() => openModalToDelete(appointment.id)}
          >
            Удалить
          </button>
        )}
        {!isCurrent && (!appointment.status || !appointment.notes) && (
          <button
            className="fill-results-button"
            onClick={() => openModal(appointment.id)}
          >
            <i className="fas fa-check"></i>
            Заполнить результаты приема
          </button>
        )}
      </li>
    ));
  

  const handleTreatmentButtonClick = () => {
    setTreatmentAssigned(true); // Скрыть кнопку, когда она нажата
    setFormData((prevData) => ({ ...prevData, treatmentFields: true }));
  };

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

      {showModalToDelete && (
        <div className="modal">
          <div className="modal-content">
            <p>Вы уверены, что хотите удалить эту запись?</p>
            <div className="modal-actions">
              <button className="confirm-button" onClick={handleDelete}>
                Да, удалить
              </button>
              <button className="cancel-button" onClick={closeModalToDelete}>
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Заполнение результатов приема</h3>

            <label>
              Диагноз:
              <select
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleFormChange}
              >
                <option value="">Выберите диагноз</option>
                {diseases.map((disease, index) => (
                        <option key={index} value={disease.name}>
                            {disease.name}
                        </option>
                        ))}
              </select>
            </label>

            <label>
              Статус:
              <input
                type="text"
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                placeholder="Статус"
              />
            </label>

            <label>
              Заметки:
              <input
                type="text"
                name="notes"
                value={formData.notes}
                onChange={handleFormChange}
                placeholder="Заметки"
              />
            </label>

            {!treatmentAssigned && (
              <button
                className="treatment-button"
                onClick={handleTreatmentButtonClick}
              >
                Назначить лечение
              </button>
            )}

            {formData.treatmentFields && (
              <>
                <label>
                  Артефакт:
                  <select
                    name="treatmentArtifact"
                    value={formData.treatmentArtifact}
                    onChange={handleFormChange}
                  >
                    <option value="">Выберите артефакт</option>
                    {artifacts.map((artifact) => (
                        <option key={artifact.id} value={artifact.id}>
                            {artifact.name}
                        </option>
                        ))}
                  </select>
                </label>

                <label>
                  Магическое существо:
                  <select
                    name="magicalCreature"
                    value={formData.magicalCreature}
                    onChange={handleFormChange}
                  >
                    <option value="">Выберите существо</option>
                    {creatures.map((creature) => (
                        <option key={creature.id} value={creature.id}>
                            {creature.name}
                        </option>
                        ))}
                  </select>
                </label>

                <label>
                    Заклинание:
                    <select
                        name="spell"
                        value={formData.spell}
                        onChange={handleFormChange}
                    >
                        <option value="">Выберите заклинание</option>
                        {spells.map((spell) => (
                        <option key={spell.od} value={spell.id}>
                            {spell.name}
                        </option>
                        ))}
                    </select>
                </label>


                <label>
                  Дата лечения:
                  <input
                    type="date"
                    name="treatmentDate"
                    value={formData.treatmentDate}
                    onChange={handleFormChange}
                  />
                </label>
              </>
            )}

            <div className="modal-actions">
              <button className="confirm-button" onClick={handleSubmit}>
                Сохранить
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

export default DoctorAppointments;
