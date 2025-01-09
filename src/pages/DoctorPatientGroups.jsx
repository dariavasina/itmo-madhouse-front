import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPatientGroupsByDoctor, deletePatientGroup } from "../slices/patientGroupSlice";
import { createPatientGroup } from "../slices/doctorSlice";
import { fetchPatients } from "../slices/patientSlice";
import { getDoctor } from "../slices/doctorSlice";
import "../styles/doctorPatientGroups.css";

const DoctorPatientGroups = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const doctor = useSelector((state) => state.doctor.doctor);
  const patientGroups = useSelector((state) => state.patientGroup.patientGroups);
  const patients = useSelector((state) => state.patient.patients);

  const [showForm, setShowForm] = useState(false);
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [specialisation, setSpecialisation] = useState("");

  useEffect(() => {
    dispatch(getDoctor([token]));
  }, [dispatch, token]);

  useEffect(() => {
    if (doctor) {
      dispatch(fetchPatientGroupsByDoctor([doctor.id, token]));
    }
  }, [doctor, token]);

  const toggleForm = () => {
    setShowForm(!showForm);
    if (!showForm) {
      dispatch(fetchPatients(token));
    }
  };

  const handlePatientSelection = (patient) => {
    setSelectedPatients((prev) =>
      prev.includes(patient) ? prev.filter((p) => p !== patient) : [...prev, patient]
    );
  };

  const handleCreateGroup = () => {
    if (!doctor || !specialisation || selectedPatients.length === 0) {
      alert("Пожалуйста, заполните все поля и выберите хотя бы одного пациента.");
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
        alert("Группа пациентов успешно создана!");
        setShowForm(false);
        setSelectedPatients([]);
        setSpecialisation("");
        dispatch(fetchPatientGroupsByDoctor([doctor.id, token]));
      })
      .catch((error) => {
        alert("Ошибка при создании группы: " + error);
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

  return (
    <div className="group-therapy-container">
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
        Удалить группу
      </button>
    </li>
  ))}
</ul>

    </div>
  );
};

export default DoctorPatientGroups;
