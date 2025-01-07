import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDoctors } from "../slices/doctorSlice";
import "../styles/doctors.css";

const Doctors = () => {
  const dispatch = useDispatch();
  const doctors = useSelector((state) => state.doctor.doctors); 
  const token = useSelector((state) => state.auth.token); 

  useEffect(() => {
    dispatch(fetchDoctors([token])); // Запрос списка врачей с токеном
  }, [dispatch, token]);


  return (
    <div className="doctors">
      <h2>Наши врачи</h2>
      <ul>
        {doctors.map((doctor) => (
          <li key={doctor.id}>
            <p><strong>Имя:</strong> {doctor.name}</p>
            <p><strong>Специализация:</strong> {doctor.specialisation}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Doctors;
