import React from "react";
import "../styles/header.css";

const Header = () => {
    return (
        <header className="header">
            <div className="logo">ПНД Хогвартса</div>
            <div className="profile">
                <span className="profile-text">Личный кабинет</span>
                <i className="profile-icon">👤</i>
            </div>
        </header>
    );
};

export default Header;
