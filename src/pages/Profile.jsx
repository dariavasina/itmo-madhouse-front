import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPatient, updatePatient } from "../slices/patientSlice";
import "../styles/profile.css";

const Profile = () => {
  const dispatch = useDispatch();
  const id = useSelector((state) => state.patient.id);
  const token = useSelector((state) => state.auth.token);
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState(null); // Для уведомлений
  const patient = useSelector((state) => state.patient.patient);

  useEffect(() => {
    dispatch(getPatient([token]));
  }, [dispatch, token]);

  useEffect(() => {
    if (patient) {
      setName(patient.name);
      setDateOfBirth(patient.dateOfBirth);
    }
  }, [patient]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000); // Уведомление исчезает через 3 секунды
  };

  const handleSave = () => {
    if (!id || !token) {
      showNotification("Ошибка: отсутствуют необходимые данные для обновления.", "error");
      return;
    }

    const updatedData = {
      name,
      dateOfBirth,
    };

    dispatch(updatePatient([id, updatedData, token]))
      .unwrap()
      .then(() => {
        showNotification("Данные успешно обновлены.", "success");
        setIsEditing(false);
      })
      .catch((error) => {
        showNotification("Ошибка при обновлении данных: " + error, "error");
      });
  };

  return (
    <div className="profile-container">
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
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
              <button className="btn save" onClick={handleSave}>
                Сохранить
              </button>
              <button className="btn cancel" onClick={() => setIsEditing(false)}>
                Отмена
              </button>
            </div>
          </div>
        ) : (
          <div className="profile-info">
            <p>
              <strong>Имя:</strong> {name}
            </p>
            <p>
              <strong>Дата рождения:</strong> {dateOfBirth}
            </p>
            <button className="btn edit" onClick={() => setIsEditing(true)}>
              Изменить данные
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
