import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import WorkshopSettings from "./pages/WorkshopSettings";
import FixRecords from "./pages/FixRecords";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Logout from "./pages/Logout";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Redirect root to /home */}
          <Route path="/" element={<Navigate to="/home" />} />

          {/* Public routes */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          

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
            path="/edit-technician/:id_technicien"
            element={
              <ProtectedRoute>
                <EditTechnician />
              </ProtectedRoute>
            }
          />

          {/* Settings route */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <WorkshopSettings />
              </ProtectedRoute>
            }
          />
          <Route
          path="/fix-records"
          element={
            <ProtectedRoute>
              <FixRecords />
            </ProtectedRoute>
          }
        />
        <Route
         path="/logout"
         element={
             <ProtectedRoute>
            <Logout />
            </ProtectedRoute>
         }
         />
          
          {/* Fallback for unmatched routes */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
