import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register, login } from '../slices/authSlice';
import '../styles/auth.css';
import { addPatient } from '../slices/patientSlice';
import { useSelector } from 'react-redux';
import { use } from 'react';

const Auth = () => {
    const dispatch = useDispatch();
    const [isRegisterMode, setRegisterMode] = useState(false);
    const [formData, setFormData] = useState({
        login: '',
        password: '',
        name: '',
        birthDate: '',
        role: 'PATIENT', 
    });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!formData.login) newErrors.login = 'Логин обязателен';
        if (!formData.password) newErrors.password = 'Пароль обязателен';
        if (isRegisterMode && formData.role === 'PATIENT') {
            if (!formData.name) newErrors.name = 'Имя обязательно';
            if (!formData.birthDate) newErrors.birthDate = 'Дата рождения обязательна';
        }
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            if (isRegisterMode) {
                const userData = {
                    login: formData.login,
                    password: formData.password,
                    role: formData.role,
                };
                console.log(userData);

                const result = await dispatch(register(userData)).unwrap();
                const token = result.token; 
                if (formData.role === 'PATIENT') {
                    const patientData = {
                        name: formData.name,
                        dateOfBirth: formData.birthDate
                    };
                
                    console.log(token);
                    console.log(patientData);
                    dispatch(addPatient([JSON.stringify(patientData), token]));
                }
            }
            else {
                const authData = {
                    login: formData.login,
                    password: formData.password
                };
                console.log(authData);
                const result = await dispatch(login(authData));
                console.log(result);
                
            }
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-inner">
                <form onSubmit={handleSubmit}>
                    <h2>{isRegisterMode ? 'Зарегистрироваться' : 'Войти'}</h2>
                    <div className="role-toggle">
                        <label>
                            <input
                                type="radio"
                                name="role"
                                value="PATIENT"
                                checked={formData.role === 'PATIENT'}
                                onChange={handleChange}
                            />
                            Пациент
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="role"
                                value="DOCTOR"
                                checked={formData.role === 'DOCTOR'}
                                onChange={handleChange}
                            />
                            Врач
                        </label>
                    </div>

                    <input
                        type="text"
                        name="login"
                        placeholder="Логин"
                        className="mb3"
                        value={formData.login}
                        onChange={handleChange}
                        required
                    />
                    {errors.login && <span className="error">{errors.login}</span>}

                    <input
                        type="password"
                        name="password"
                        placeholder="Пароль"
                        className="mb3"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    {errors.password && <span className="error">{errors.password}</span>}

                    {isRegisterMode && formData.role === 'PATIENT' && (
                        <>
                            <input
                                type="text"
                                name="name"
                                placeholder="Имя"
                                className="mb3"
                                value={formData.name}
                                onChange={handleChange}
                            />
                            {errors.name && <span className="error">{errors.name}</span>}

                            <input
                                type="date"
                                name="birthDate"
                                placeholder="Дата рождения"
                                className="mb3"
                                value={formData.birthDate}
                                onChange={handleChange}
                            />
                            {errors.birthDate && <span className="error">{errors.birthDate}</span>}
                        </>
                    )}

                    <button type="submit">
                        {isRegisterMode ? 'Зарегистрироваться' : 'Войти'}
                    </button>

                    <p className="forgot-password text-right">
                        {isRegisterMode ? (
                            <span>
                                Уже есть аккаунт?{' '}
                                <button
                                    type="button"
                                    onClick={() => setRegisterMode(false)}
                                >
                                    Войти
                                </button>
                            </span>
                        ) : (
                            <span>
                                Еще нет аккаунта?{' '}
                                <button
                                    type="button"
                                    onClick={() => setRegisterMode(true)}
                                >
                                    Зарегистрироваться
                                </button>
                            </span>
                        )}
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Auth;
