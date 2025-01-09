import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDoctor } from "../slices/doctorSlice";
import "../styles/profile.css";

const DoctorProfile = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const doctor = useSelector((state) => state.doctor.doctor);
  
  useEffect(() => {
    dispatch(getDoctor([token]));
    console.log("dispatched");
  }, [dispatch, token]);

  useEffect(() => {
    if (doctor) {
      console.log(doctor);
      setName(doctor.name);
      // Преобразуем дату в формат YYYY-MM-DD
      const formattedDate = new Date(doctor.dateOfBirth).toLocaleDateString("en-CA"); 
      setDateOfBirth(formattedDate); // Пример: "1980-03-21"
    }
  }, [doctor]);

  const handleSave = () => {
    // Логика для сохранения данных
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

export default DoctorProfile;
