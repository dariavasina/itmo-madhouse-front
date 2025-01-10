import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPatientGroupsByDoctor, deletePatientGroup } from "../slices/patientGroupSlice";
import { createPatientGroup } from "../slices/doctorSlice";
import { fetchPatients } from "../slices/patientSlice";
import { getDoctor } from "../slices/doctorSlice";
import { fetchSpells } from "../slices/spellSlice";
import { fetchCreatures } from "../slices/creatureSlice";
import { fetchArtifacts } from "../slices/artifactSlice";
import { addGroupTherapy, fetchGroupTherapiesByPatientGroup } from "../slices/patientGroupSlice";
import "../styles/doctorPatientGroups.css";
import { FaTrash, FaUsers } from "react-icons/fa";

const DoctorPatientGroups = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [notification, setNotification] = useState(null); // Для уведомлений


  const doctor = useSelector((state) => state.doctor.doctor);
  const patientGroups = useSelector((state) => state.patientGroup.patientGroups);
  const patients = useSelector((state) => state.patient.patients);
  const spells = useSelector((state) => state.spell.spells);
  const creatures = useSelector((state) => state.creature.creatures);
  const artifacts = useSelector((state) => state.artifact.artifacts);

  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);  // Состояние для модального окна
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [specialisation, setSpecialisation] = useState("");
  const [selectedPatientGroup, setSelectedPatientGroup] = useState(null);
  const [groupTherapies, setGroupTherapies] = useState({});

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000); // Уведомление исчезает через 3 секунды
  };

  const [formData, setFormData] = useState({
    treatmentArtifact: "",
    magicalCreature: "",
    spell: "",
    therapyDate: "",
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    dispatch(getDoctor([token]));
  }, [dispatch, token]);

  useEffect(() => {
    if (doctor) {
      dispatch(fetchPatientGroupsByDoctor([doctor.id, token]));
    }
  }, [doctor, token]);

  useEffect(() => {
    dispatch(fetchSpells([token]));
    dispatch(fetchCreatures([token]));
    dispatch(fetchArtifacts([token]));
  }, [dispatch, token]);

  useEffect(() => {
    patientGroups.forEach((patientGroup) => {
      if (patientGroup.id) {
        dispatch(fetchGroupTherapiesByPatientGroup([patientGroup.id, token]))
          .unwrap()
          .then((therapies) => {
            setGroupTherapies((prevTherapies) => ({
              ...prevTherapies,
              [patientGroup.id]: therapies,
            }));
          })
          .catch((error) => {
            console.error("Ошибка при получении терапий для группы:", error);
          });
      }
    });
  }, [patientGroups, dispatch, token]);

  const toggleForm = () => {
    setShowForm(!showForm);
    if (!showForm) {
      dispatch(fetchPatients(token));
    }
  };

  const toggleModal = (patientGroup = null) => {
    setSelectedPatientGroup(patientGroup);
    setShowModal(!showModal);
  };

  const handlePatientSelection = (patient) => {
    setSelectedPatients((prev) =>
      prev.includes(patient) ? prev.filter((p) => p !== patient) : [...prev, patient]
    );
  };

  const handleCreateGroup = () => {
    if (!doctor || !specialisation || selectedPatients.length === 0) {
      showNotification("Заполните все поля для создания группы.", "error");
      return;
    }

    const doctorId = doctor.id;
    const patients = selectedPatients.map((p) => ({ id: p.id, name: p.name }));

    dispatch(
      createPatientGroup({
        doctorId,
        specialisation,
        patients,
        token,
      })
    )
      .unwrap()
      .then(() => {
        showNotification("Группа пациентов успешно создана.", "success");
        setShowForm(false);
        setSelectedPatients([]);
        setSpecialisation("");
        dispatch(fetchPatientGroupsByDoctor([doctor.id, token]));
      })
      .catch((error) => {
        showNotification("Ошибка при создании группы: " + error, "error");
      });
  };

  const handleDeleteGroup = (groupId) => {
    if (window.confirm("Вы уверены, что хотите удалить эту группу?")) {
      dispatch(deletePatientGroup([groupId, token]))
        .unwrap()
        .then(() => {
          alert("Группа пациентов успешно удалена!");
          dispatch(fetchPatientGroupsByDoctor([doctor.id, token]));
        })
        .catch((error) => {
          alert("Ошибка при удалении группы: " + error);
        });
    }
  };

  const handleAddGroupTherapy = () => {
    if (!selectedPatientGroup) {
      alert("Группа не выбрана!");
      return;
    }

    const groupTherapy = {
      patientGroup: selectedPatientGroup,
      artifact: formData.treatmentArtifact ? { id: parseInt(formData.treatmentArtifact, 10) } : null,
      creature: formData.magicalCreature ? { id: parseInt(formData.magicalCreature, 10) } : null,
      spell: formData.spell ? { id: parseInt(formData.spell, 10) } : null,
      therapyDate: formData.therapyDate,
    };

    console.log("groupTherapy", groupTherapy);
    dispatch(addGroupTherapy([groupTherapy, token]))
      .unwrap()
      .then(() => {
        alert("Групповая терапия успешно назначена!");
        toggleModal();
      })
      .catch((error) => {
        alert("Ошибка при назначении терапии: " + error);
      });
  };

  return (
    <div className="group-therapy-container">
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      <h2>Группы пациентов</h2>
      <button className="add-group-button" onClick={toggleForm}>
        {showForm ? "Отменить" : "Добавить группу пациентов"}
      </button>
      {showForm && (
        <div className="add-group-form">
          <h3>Новая группа пациентов</h3>
          <input
            type="text"
            placeholder="Введите специализацию"
            value={specialisation}
            onChange={(e) => setSpecialisation(e.target.value)}
            className="specialisation-input"
          />
          <ul className="patients-list">
            {patients.map((patient) => (
              <li
                key={patient.id}
                className={`patient-item ${
                  selectedPatients.includes(patient) ? "selected" : ""
                }`}
                onClick={() => handlePatientSelection(patient)}
              >
                {patient.name}
              </li>
            ))}
          </ul>
          <button className="create-group-button" onClick={handleCreateGroup}>
            Создать группу
          </button>
        </div>
      )}

      <ul className="patient-groups-list">
        {patientGroups.map((patientGroup) => (
          <li key={patientGroup.id} className="patient-group-item">
            <p>
              <strong>Специализация:</strong> {patientGroup.specialisation}
            </p>
            <p>
              <strong>Пациенты:</strong>
            </p>
            <ul className="group-patients-list">
              {patientGroup.patients && patientGroup.patients.length > 0 ? (
                patientGroup.patients.map((patient) => (
                  <li key={patient.id} className="group-patient-item">
                    {patient.name}
                  </li>
                ))
              ) : (
                <p>Нет пациентов в группе</p>
              )}
            </ul>
            <button
              className="delete-group-button"
              onClick={() => handleDeleteGroup(patientGroup.id)}
            >
              <FaTrash /> Удалить группу
            </button>

            {/* Добавляем кнопку для открытия модального окна назначения терапии */}
            <button
              className="assign-therapy-button"
              onClick={() => toggleModal(patientGroup)} // Передаем выбранную группу
            >
              <FaUsers /> Назначить групповую терапию
            </button>

            {/* Отображаем групповые терапии, привязанные к группе */}
            {groupTherapies[patientGroup.id] && groupTherapies[patientGroup.id].length > 0 && (
              <div>
                <h4>Назначенные групповые терапии:</h4>
                <ul>
                  {groupTherapies[patientGroup.id].map((therapy) => (
                    <li key={therapy.id} className="therapy-item">
                      <div>
                        <strong>Дата терапии:</strong> {therapy.therapyDate || "Не указана"}
                      </div>
                      <div>
                        <strong>Заклинание:</strong> {therapy.spell ? therapy.spell.name : "Не указано"}
                      </div>
                      <div>
                        <strong>Магическое существо:</strong> {therapy.creature ? therapy.creature.name : "Не указано"}
                      </div>
                      <div>
                        <strong>Артефакт:</strong> {therapy.artifact ? therapy.artifact.name : "Не указан"}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </li>
        ))}
      </ul>

      {/* Модальное окно для назначения групповой терапии */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Назначить групповую терапию</h3>
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
                  Дата терапии:
                  <input
                    type="date"
                    name="therapyDate"
                    value={formData.therapyDate}
                    onChange={handleFormChange}
                  />
                </label>
                <div className="modal-buttons-container">
                  <button
                    className="submit-therapy-button"
                    onClick={() => handleAddGroupTherapy()}
                  >
                    Назначить терапию
                  </button>
                  <button className="close-modal-button" onClick={toggleModal}>
                    Закрыть
                  </button>
                </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorPatientGroups;
