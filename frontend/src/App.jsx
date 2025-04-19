// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authProvider";     
import ProtectedRoute from "./context/protectedRoutes";
import HomePage from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RepairRequests from "./pages/RepairRequests";
import NewRequest from "./pages/NewRequest";
import EditRequest from "./pages/EditRequest";
import TechniciansPage from "./pages/TechniciansPage";
import NewTechnician from "./pages/NewTechnician";
import EditTechnician from "./pages/EditTechnician";

function App() {
  return (
    <AuthProvider>            {/* ← لفّ هنا */}
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Admin-only routes */}
          <Route
            path="/repair-requests"
            element={
              <ProtectedRoute>
                <RepairRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/new-request"
            element={
              <ProtectedRoute>
                <NewRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-request/:id"
            element={
              <ProtectedRoute>
                <EditRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/technicians"
            element={
              <ProtectedRoute>
                <TechniciansPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/new-technician"
            element={
              <ProtectedRoute>
                <NewTechnician />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-technician/:id"
            element={
              <ProtectedRoute>
                <EditTechnician />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
