import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/sidebar.css";
import { FaUser, FaCalendarCheck, FaUsers, FaStethoscope, FaBook, FaSignOutAlt } from 'react-icons/fa'; // Иконки
import { useDispatch } from "react-redux";
import { logout } from "../slices/authSlice"; // Импортируем экшен logout

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout()); // Отправляем экшен для выхода
    navigate("/login"); // Перенаправляем на страницу логина
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
            <FaUsers className="sidebar-icon" /> Моя группа
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
      </ul>
      <button className="logout-button" onClick={handleLogout}>
        <FaSignOutAlt className="sidebar-icon" /> Выйти
      </button>
    </div>
  );
};

export default Sidebar;
