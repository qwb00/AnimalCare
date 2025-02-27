import React, { useEffect } from "react";
import { useNavigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Animals from "./pages/Animals";
import Reservations from "./pages/Reservations";
import VeterinarianExaminations from "./pages/VeterinarianExaminations";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BackToTop from "./components/BackToTop";

import UserGeneral from "./pages/UserGeneral";
import AnimalDetails from "./pages/AnimalDetails";
import Volunteers from "./pages/Volunteers";
import Users from "./pages/Users";
import UserReservationsConfirm from "./pages/UserReservationsConfirm";
import Prescriptions from "./pages/Prescriptions";
import PlannedWalks from "./pages/PlannedWalks";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const expirationTime = sessionStorage.getItem("expirationTime");

    if (expirationTime && Date.now() > expirationTime) {
      sessionStorage.clear();
      alert("Your session has expired. Please log in again.");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/animals" element={<Animals />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/:userID/general" element={<UserGeneral />} />
        <Route path="/animals/:animalID" element={<AnimalDetails />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route
          path="/:userID/veterinarian-examinations"
          element={<VeterinarianExaminations />}
        />
        <Route
          path="/:userID/medical-prescriptions"
          element={<Prescriptions />}
        />
        <Route path="/:userID/volunteers" element={<Volunteers />} />
        <Route path="/:userID/users" element={<Users />} />
        <Route
          path="/:userID/user-reservations"
          element={<UserReservationsConfirm />}
        />
        <Route path="/:userID/planned-walks" element={<PlannedWalks />} />
      </Routes>
      <BackToTop />
    </>
  );
}

export default App;
