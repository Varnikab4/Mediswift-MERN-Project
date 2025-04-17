import logo from "./logo.svg";
import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useSelector } from "react-redux";
import Spinner from "./components/Spinner";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import ApplyDoctor from "./pages/ApplyDoctor";
import NotificationPage from "./pages/NotificationPage";
import Users from "./pages/admin/Users";
import Doctors from "./pages/admin/Doctors";
import Profile from "./pages/doctor/Profile";
import DoctorsList from "./pages/DoctorsList";
import BookingPage from "./pages/BookingPage";
import Appointments from "./pages/Appointments";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import NewsBlog from "./pages/NewsBlog";
import UserProfile from "./pages/UserProfile";
import Chatbot from "./components/Chatbot";
import Analyzer from "./pages/Analyzer"; // Import the new Analyzer page

function App() {
  const { loading } = useSelector((state) => state.alerts);

  return (
    <>
      <BrowserRouter>
        {loading ? (
          <Spinner />
        ) : (
          <>
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Homepage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/apply-doctor"
                element={
                  <ProtectedRoute>
                    <ApplyDoctor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/Login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/Register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />
              <Route
                path="/notification"
                element={
                  <ProtectedRoute>
                    <NotificationPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute>
                    <Users />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/doctors"
                element={
                  <ProtectedRoute>
                    <Doctors />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctor/profile/:id"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctorslist"
                element={
                  <ProtectedRoute>
                    <DoctorsList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctor/book-appointment/:doctorId"
                element={
                  <ProtectedRoute>
                    <BookingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointments"
                element={
                  <ProtectedRoute>
                    <Appointments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctor-appointments"
                element={
                  <ProtectedRoute>
                    <DoctorAppointments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/newsBlog"
                element={
                  <ProtectedRoute>
                    <NewsBlog />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                }
              />
              
              {/* New Analyzer Route */}
              <Route
                path="/analyzer"
                element={
                  <ProtectedRoute>
                    <Analyzer />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Chatbot /> {/* ✅ Chatbot is globally accessible */}
          </>
        )}
      </BrowserRouter>
    </>
  );
}

export default App;