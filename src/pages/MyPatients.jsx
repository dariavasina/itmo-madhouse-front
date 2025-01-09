import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPatients } from "../slices/patientSlice"; // Action to fetch patients
import { getDoctor } from "../slices/doctorSlice"; // Action to get doctor info
import "../styles/myPatients.css"; // Add your styles here

const MyPatients = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token); // Selector for auth token
  const doctorId = useSelector((state) => state.doctor.id); // Selector for doctor ID
  const patients = useSelector((state) => state.patient.patients); // Selector for all patients
  const filteredPatients = patients.filter(
    (patient) => patient.doctor.id === doctorId
  ); // Filter patients by doctor ID

  useEffect(() => {
    dispatch(getDoctor([token])); // Fetch doctor info to get doctorId
    dispatch(fetchPatients([token])); // Fetch all patients
  }, [dispatch, token]);

  return (
    <div className="my-patients">
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
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.name}</td>
                <td>{patient.dateOfBirth}</td>
                <td>{patient.disease.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyPatients;
