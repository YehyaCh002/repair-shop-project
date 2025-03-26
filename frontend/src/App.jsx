import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RepairRequests from "./pages/RepairRequests";
import EditRequest from "./pages/EditRequest";
import NewRequest from "./pages/NewRequest";
import HomePage from "./pages/Home";
import TechniciansPage from "./pages/TechniciansPage";
import EditTechnician from "./pages/EditTechnician";


function App() {
  return (
    <Router> 
   <div className="App">
   <Routes>
          <Route path="/" element={<RepairRequests />} />
          <Route path="/repair-requests" element={<RepairRequests />} />
          <Route path="/new-request" element={<NewRequest />} />
          <Route path="/edit-request/:id" element={<EditRequest />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/technicians" element={<TechniciansPage />}></Route>
          <Route path="/edit-technician/:id" element={<EditTechnician />}></Route>

        </Routes>     

    </div>
    </Router>

    );
}

export default App;
