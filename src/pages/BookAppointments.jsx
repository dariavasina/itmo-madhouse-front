import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { fetchUnavailableSlots, addAppointment } from '../slices/appointmentSlice';
import { fetchDoctors } from '../slices/doctorSlice';
import "../styles/bookAppointment.css";
import { TfiControlShuffle } from 'react-icons/tfi';
import { getPatient } from '../slices/patientSlice';

const BookAppointments = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [specialization, setSpecialization] = useState('');
    const [doctorId, setDoctorId] = useState('');
    const [selectedSlot, setSelectedSlot] = useState(null); // Храним метку времени выбранного слота
    const unavailableSlots = useSelector((state) => state.appointment.unavailableSlots);
    const doctors = useSelector((state) => state.doctor.doctors);
    const patientId = useSelector((state) => state.patient.id);
    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();

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
        setSelectedSlot(slot.getTime()); // Сохраняем метку времени для выбранного слота
    };

    const specializations = Array.from(new Set(doctors.map((doctor) => doctor.specialisation)));

    const filteredDoctors = doctors.filter((doctor) => doctor.specialisation === specialization);

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
        console.log("All generated slots:", allSlots);
    
        // Фильтрация слотов, которые не находятся в списке unavailableSlots
        const availableSlots = allSlots.filter(slot => {
            console.log("Checking slot:", slot);
    
            // Преобразуем время в миллисекунды для корректного сравнения
            const slotTime = slot.getTime();
    
            const isUnavailable = unavailableSlots.some(unavailableSlot => {
                // Преобразуем appointmentDate в объект Date, если это строка
                const unavailableSlotTime = new Date(unavailableSlot.appointmentDate).getTime();
                console.log("Comparing with unavailable slot time:", unavailableSlotTime);
    
                return unavailableSlotTime === slotTime;
            });
    
            console.log("Is unavailable:", isUnavailable);
            return !isUnavailable;
        });
    
        console.log("Available slots:", availableSlots);
        return availableSlots;
    };
    
    

    const handleSubmit = () => {
        if (!selectedSlot || !doctorId) {
            alert('Выберите врача и временной слот');
            return;
        }

        const updatedSlot = new Date(selectedSlot);
        updatedSlot.setHours(updatedSlot.getHours() + 3);
        const appointmentDateISOString = updatedSlot.toISOString();
        console.log(appointmentDateISOString);

        dispatch(addAppointment({
            patientId,
            doctorId,
            appointmentDate: appointmentDateISOString,
            status: 'BOOKED',
            notes: '',
            token,
        }));
    };

    return (
        <div>
            <h1>Запись на прием</h1>

            <label htmlFor="specialization">Выберите специализацию:</label>
            <select
                id="specialization"
                onChange={(e) => {
                    setSpecialization(e.target.value);
                    setDoctorId('');
                }}
            >
                <option value="">--Выберите--</option>
                {specializations.map((spec) => (
                    <option key={spec} value={spec}>
                        {spec}
                    </option>
                ))}
            </select>

            {specialization && (
                <>
                    <label htmlFor="doctor">Выберите врача:</label>
                    <select id="doctor" onChange={(e) => setDoctorId(e.target.value)}>
                        <option value="">--Выберите--</option>
                        {filteredDoctors.map((doctor) => (
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
                        {getAvailableSlots().map((slot) => {
                            const isSlotUnavailable = unavailableSlots.some(unavailableSlot => new Date(unavailableSlot).getTime() === slot.getTime());
                            return (
                                <li
                                    key={slot.getTime()}
                                    onClick={() => handleSlotSelection(slot)}
                                    className={`slot-item ${selectedSlot === slot.getTime() ? 'selected' : ''} ${isSlotUnavailable ? 'unavailable' : ''}`}
                                >
                                    {slot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </li>
                            );
                        })}
                    </ul>

                    <button onClick={handleSubmit}>Записаться</button>
                </>
            )}
        </div>
    );
};

export default BookAppointments;
