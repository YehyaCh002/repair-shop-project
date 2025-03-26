import { useEffect, useState } from "react";
import Sidebar from "/src/components/Sidebar";
import { Link } from "react-router-dom";
import { FiEdit, FiTrash2, FiEye, FiSearch } from "react-icons/fi";
import { getRepairsRequest } from "/src/services/api";

export default function RepairRequests() {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");

  // ✅ Fetch repair requests from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getRepairsRequest();
        console.log("Fetched Data in Component:", data);
        if (Array.isArray(data)) {
          setRequests(data); // ✅ Only set if it's an array
        } else {
          console.error("Unexpected data format:", data);
          setRequests([]); // Ensure state is reset if data is invalid
        }
      } catch (error) {
        console.error("Error fetching repair requests:", error);
      }
    };
  
    fetchData();
  }, []);
  

  // ✅ Delete Function
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this repair request?")) {
      return; // ✅ Stop if user cancels
    }

    try {
      const response = await fetch(`http://localhost:5000/requests/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setRequests((prevRequests) => prevRequests.filter((req) => req.id !== id)); // ✅ Correct state update
      } else {
        console.error("Failed to delete the repair request.");
      }
    } catch (error) {
      console.error("Error deleting repair request:", error);
    }
  };

  return (
    <div className="flex h-screen w-screen">
      <Sidebar />
      <div className="flex-1 p-4 sm:p-6 bg-gray-100 text-black min-h-screen overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-full max-w-md">
            <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search repair requests..."
              className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded shadow text-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Link to="/new-request">
            <button className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all ml-4">
              + New Repair Request
            </button>
          </Link>
        </div>

        {/* Repair Requests Table */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-700 text-center">
                  <th className="p-3 border">Client Name</th>
                  <th className="p-3 border">Phone</th>
                  <th className="p-3 border">Device</th>
                  <th className="p-3 border">Problem</th>
                  <th className="p-3 border">Status</th>
                  <th className="p-3 border">Cost ($)</th>
                  <th className="p-3 border">Entry Date</th>
                  <th className="p-3 border">Delivery Date</th>
                  <th className="p-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center p-4">
                      No repair requests found.
                    </td>
                  </tr>
                ) : (
                  requests
                    .filter((req) =>
                      req.client_name?.toLowerCase().includes(search.toLowerCase()) // ✅ Ensure `client_name` exists
                    )
                    .map((req) => (
                      <tr key={req.id} className="hover:bg-gray-100">
                        <td className="p-3 border">{req.client_name}</td>
                        <td className="p-3 border">{req.phone_number}</td>
                        <td className="p-3 border">{req.device_type}</td>
                        <td className="p-3 border">{req.problem_description}</td>
                        <td className="p-3 border">
                          <span
                            className={`px-2 py-1 text-sm font-semibold rounded 
                            ${
                              req.status === "Not Repaired"
                                ? "bg-red-200 text-red-800"
                                : req.status === "In Progress"
                                ? "bg-yellow-200 text-yellow-800"
                                : "bg-green-200 text-green-800"
                            }`}
                          >
                            {req.status || "Unknown"} {/* ✅ Handle empty status */}
                          </span>
                        </td>
                        <td className="p-3 border">${req.cost}</td>
                        <td className="p-3 border">{req.entry_date}</td>
                        <td className="p-3 border">{req.delivery_date || "N/A"}</td>
                        <td className="p-3 border flex gap-3 justify-center">
                          <FiEye className="text-blue-500 text-xl cursor-pointer hover:text-blue-700" title="View" />
                          <Link to={`/edit-request/${req.id}`}>
                            <FiEdit className="text-green-500 text-xl cursor-pointer hover:text-green-700" title="Edit" />
                          </Link>
                          <FiTrash2
                            className="text-red-500 text-xl cursor-pointer hover:text-red-700"
                            title="Delete"
                            onClick={() => handleDelete(req.id)}
                          />
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
