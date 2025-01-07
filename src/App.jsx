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
import BookAppointments from "./pages/BookAppointments";
import Doctors from "./pages/Doctors";

function AppContent() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userRole = useSelector((state) => state.auth.role);

  return (
    <Router>
      <div className="App">
        {/* <Header /> */}
        {isAuthenticated ? (
          userRole === "PATIENT" ? (
            <div className="main-content">
              <Sidebar />
              <div className="page-content">
                <Routes>
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/appointments" element={<Appointments />} />
                  <Route path="/group-therapy" element={<GroupTherapy />} />
                  <Route path="/book-appointment" element={<BookAppointments />} />
                  <Route path="/doctors" element={<Doctors />} />
                  <Route path="*" element={<Navigate to="/profile" />} />
                </Routes>
              </div>
            </div>
          ) : (
            <h1>ЛК врача</h1>
          )
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
