import React from "react";
import { useSelector } from "react-redux";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import store, { persistor } from "./store";
import "./styles/App.css";
import Auth from "./components/Auth";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Profile from "./pages/Profile";
import Appointments from "./pages/Appointments";
import GroupTherapy from "./pages/GroupTherapy";
import BookAppointment from "./pages/BookAppointment";
import Doctors from "./pages/Doctors";
import DoctorProfile from "./pages/DoctorProfile";
import DoctorAppointments from "./pages/DoctorAppointments";
import DoctorPatientGroups from "./pages/DoctorPatientGroups";
import Testing from "./pages/Testing";
import MyPatients from "./pages/MyPatients";

function AppContent() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userRole = useSelector((state) => state.auth.role);

  return (
    <Router>
      <div className="App">
        {isAuthenticated ? (
          <div className="main-content">
            <Sidebar />
            <div className="page-content">
              <Routes>
                {userRole === "PATIENT" ? (
                  <>
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/appointments" element={<Appointments />} />
                    <Route path="/group-therapy" element={<GroupTherapy />} />
                    <Route path="/book-appointment" element={<BookAppointment />} />
                    <Route path="/doctors" element={<Doctors />} />
                    <Route path="*" element={<Navigate to="/profile" />} />
                    <Route path="/testing" element={<Testing />} />
                  </>
                ) : userRole === "DOCTOR" ? (
                  <>
                    <Route path="/profile" element={<DoctorProfile />} />
                    <Route path="/appointments" element={<DoctorAppointments />} />
                    <Route path="/group-therapy" element={<DoctorPatientGroups />} />
                    <Route path="my-patients" element={<MyPatients />} />
                    <Route path="*" element={<Navigate to="/profile" />} />
                  </>
                ) : (
                  <Navigate to="/login" />
                )}
              </Routes>
            </div>
          </div>
        ) : (
          <Auth />
        )}
      </div>
    </Router>
  );
}


const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
};

export default App;
