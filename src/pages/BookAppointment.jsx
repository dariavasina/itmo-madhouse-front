import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { fetchUnavailableSlots, addAppointment } from '../slices/appointmentSlice';
import { fetchDoctors } from '../slices/doctorSlice';
import "../styles/bookAppointment.css";
import { TfiControlShuffle } from 'react-icons/tfi';
import { getPatient } from '../slices/patientSlice';


const BookAppointment = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [specialization, setSpecialization] = useState('');
    const [doctorId, setDoctorId] = useState('');
    const [selectedSlot, setSelectedSlot] = useState(null);
    const unavailableSlots = useSelector((state) => state.appointment.unavailableSlots);
    const doctors = useSelector((state) => state.doctor.doctors);
    const patientId = useSelector((state) => state.patient.id);
    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();
    const [successMessage, setSuccessMessage] = useState(false);
    const [notification, setNotification] = useState(null); // Для уведомлений

    const showNotification = (message, type = "success") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000); // Уведомление исчезает через 3 секунды
    };

    useEffect(() => {
        dispatch(getPatient([token]));
        dispatch(fetchDoctors([token]));
    }, [dispatch, token]);

    useEffect(() => {
        if (doctorId && selectedDate) {
            const dateFrom = new Date(selectedDate).toISOString();
            const dateTo = new Date(new Date(selectedDate).setDate(selectedDate.getDate() + 1)).toISOString();
            dispatch(fetchUnavailableSlots({ doctorId, dateFrom, dateTo, token }));
        }
    }, [doctorId, selectedDate, dispatch, token]);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleSlotSelection = (slot) => {
        setSelectedSlot(slot.getTime());
    };

    const generateSlots = () => {
        const slots = [];
        for (let hour = 8; hour <= 16; hour++) {
            const localDate = new Date(selectedDate);
            localDate.setHours(hour, 0, 0, 0);
            slots.push(localDate);
        }
        return slots;
    };

    const getAvailableSlots = () => {
        const allSlots = generateSlots();
        return allSlots.filter((slot) =>
            !unavailableSlots.some((unavailableSlot) => 
                new Date(unavailableSlot.appointmentDate).getTime() === slot.getTime()
            )
        );
    };

    const handleSubmit = () => {
        if (!selectedSlot || !doctorId) {
            showNotification("Ошибка: не выбран врач или временной слот.", "error");
            return;
        }

        const updatedSlot = new Date(selectedSlot);
        updatedSlot.setHours(updatedSlot.getHours() + 3);
        const appointmentDateISOString = updatedSlot.toISOString();

        dispatch(addAppointment({
            patientId,
            doctorId,
            appointmentDate: appointmentDateISOString,
            status: 'BOOKED',
            notes: '',
            token,
        }))
        .unwrap()
        .then(() => {
            showNotification("Вы успешно записались на прием!", "success");
        })
        .catch((error) => {
            showNotification("Ошибка при записи на прием: " + error, "error");
        });


        // Сброс формы и установка сообщения
        setSpecialization('');
        setDoctorId('');
        setSelectedSlot(null);
        setSelectedDate(new Date());
    };

    return (
        <div>
            <h1>Запись на прием</h1>
            {notification && (
                <div className={`notification ${notification.type}`}>
                {notification.message}
                </div>
            )}
            {!successMessage && ( // Показываем форму только если нет сообщения
                <>
                    <label htmlFor="specialization">Выберите специализацию:</label>
                    <select
                        id="specialization"
                        value={specialization}
                        onChange={(e) => {
                            setSpecialization(e.target.value);
                            setDoctorId('');
                        }}
                    >
                        <option value="">--Выберите--</option>
                        {Array.from(new Set(doctors.map((doctor) => doctor.specialisation))).map((spec) => (
                            <option key={spec} value={spec}>
                                {spec}
                            </option>
                        ))}
                    </select>

                    {specialization && (
                        <>
                            <label htmlFor="doctor">Выберите врача:</label>
                            <select
                                id="doctor"
                                value={doctorId}
                                onChange={(e) => setDoctorId(e.target.value)}
                            >
                                <option value="">--Выберите--</option>
                                {doctors
                                    .filter((doctor) => doctor.specialisation === specialization)
                                    .map((doctor) => (
                                        <option key={doctor.id} value={doctor.id}>
                                            {doctor.name}
                                        </option>
                                    ))}
                            </select>
                        </>
                    )}

                    {doctorId && (
                        <>
                            <Calendar
                                onChange={handleDateChange}
                                value={selectedDate}
                                minDate={new Date()}
                                maxDate={new Date(new Date().setDate(new Date().getDate() + 14))}
                            />

                            <h2>Доступные временные слоты</h2>
                            <ul>
                                {getAvailableSlots().map((slot) => (
                                    <li
                                        key={slot.getTime()}
                                        onClick={() => handleSlotSelection(slot)}
                                        className={`slot-item ${selectedSlot === slot.getTime() ? 'selected' : ''}`}
                                    >
                                        {slot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </li>
                                ))}
                            </ul>

                            <button onClick={handleSubmit}>Записаться</button>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default BookAppointment;
