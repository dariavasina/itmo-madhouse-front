import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPatient } from "../slices/patientSlice"; // импортируем getPatient
import "../styles/profile.css";

const Profile = () => {
  const dispatch = useDispatch();
  const id = useSelector((state) => state.patient.id);
  const token = useSelector((state) => state.auth.token);
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const patient = useSelector((state) => state.patient.patient);
  console.log(token);

  useEffect(() => {
    dispatch(getPatient([token]));
    console.log("dispatched")
  }, [dispatch, token]);

  useEffect(() => {
    if (patient) {
      console.log(patient);
      setName(patient.name);
      setDateOfBirth(patient.dateOfBirth);
    }
  }, [patient]);

  const handleSave = () => {
    // Здесь можно добавить логику для отправки обновленных данных на сервер
    setIsEditing(false);
  };
  

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Мой профиль</h2>
        {isEditing ? (
          <div className="profile-edit">
            <label>
              Имя:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="profile-input"
              />
            </label>
            <label>
              Дата рождения:
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="profile-input"
              />
            </label>
            <div className="profile-buttons">
              <button className="btn save" onClick={handleSave}>Сохранить</button>
              <button className="btn cancel" onClick={() => setIsEditing(false)}>Отмена</button>
            </div>
          </div>
        ) : (
          <div className="profile-info">
            <p><strong>Имя:</strong> {name}</p>
            <p><strong>Дата рождения:</strong> {dateOfBirth}</p>
            <button className="btn edit" onClick={() => setIsEditing(true)}>Изменить данные</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
