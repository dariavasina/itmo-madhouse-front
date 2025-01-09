import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/sidebar.css";
import { FaUser, FaCalendarCheck, FaUsers, FaStethoscope, FaBook, FaSignOutAlt, FaClipboardList } from 'react-icons/fa'; 
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../slices/authSlice"; 
import { getDoctor } from "../slices/doctorSlice"; // Assuming this is your action for fetching doctor data

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userRole = useSelector((state) => state.auth.role);
  const doctorSpecialisation = useSelector((state) => state.doctor.specialisation); // Selector for the doctor's specialization
  const token = useSelector((state) => state.auth.token); // Assuming token is stored in auth slice

  useEffect(() => {
    if (userRole === "DOCTOR") {
      dispatch(getDoctor([token])); // Dispatch action to get doctor data if role is "DOCTOR"
    }
  }, [userRole, token, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <ul>
        <li>
          <NavLink
            to="/profile"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaUser className="sidebar-icon" /> Профиль
          </NavLink>
        </li>
        {userRole === "PATIENT" ? (
          <>
            <li>
              <NavLink
                to="/appointments"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <FaCalendarCheck className="sidebar-icon" /> Записи на прием
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/group-therapy"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <FaUsers className="sidebar-icon" /> Групповая терапия
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/book-appointment"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <FaBook className="sidebar-icon" /> Записаться на прием
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/doctors"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <FaStethoscope className="sidebar-icon" /> Наши врачи
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/testing"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <FaClipboardList className="sidebar-icon" /> Пройти тестирование
              </NavLink>
            </li>
          </>
        ) : userRole === "DOCTOR" ? (
          <>
            <li>
              <NavLink
                to="/appointments"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <FaCalendarCheck className="sidebar-icon" /> Записи пациентов
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/group-therapy"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <FaUsers className="sidebar-icon" /> Группы пациентов
              </NavLink>
            </li>
            {doctorSpecialisation === "general practitioner" && (
              <li>
                <NavLink
                  to="/my-patients"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <FaClipboardList className="sidebar-icon" /> Мои пациенты
                </NavLink>
              </li>
            )}
          </>
        ) : null}
      </ul>
      <button className="logout-button" onClick={handleLogout}>
        <FaSignOutAlt className="sidebar-icon" /> Выйти
      </button>
    </div>
  );
};

export default Sidebar;
