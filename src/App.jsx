import "./App.css";
import SignUp from "./assets/components/SignUp";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./assets/components/Navbar";
import Home from "./assets/components/Home";
import UserProfile from "./assets/components/UserProfile";
import ProtectedRoute from "./assets/components/ProtectedRoute";
import Applications from "./assets/components/Applications";
import Reminders from "./assets/components/Reminders";
import Companies from "./assets/components/Companies";
import Dashboard from "./assets/components/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      {/* 👇 this wrapper ensures all content starts below the fixed navbar */}
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/home" element={<Home />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications"
            element={
              <ProtectedRoute>
                <Applications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reminders"
            element={
              <ProtectedRoute>
                <Reminders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/companies"
            element={
              <ProtectedRoute>
                <Companies />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dash"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
