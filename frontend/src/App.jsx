import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RepairRequests from "./components/RepairRequests";
import EditRequest from "./components/EditRequest";
import NewRequest from "./components/NewRequest";
import HomePage from "./components/Home";


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

        </Routes>     

    </div>
    </Router>

    );
}

export default App;
