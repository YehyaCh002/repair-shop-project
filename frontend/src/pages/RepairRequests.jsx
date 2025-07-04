import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import Sidebar from "../components/Sidebar";
import { FiEdit, FiTrash2, FiEye, FiSearch } from "react-icons/fi";

export default function RepairRequests() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]       = useState("");
  const [search, setSearch]     = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (!user?.id_workshop) navigate("/login");
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (authLoading || !user?.id_workshop) return;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("http://localhost:5000/api/get-repairs", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        setRequests(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [authLoading, user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this request?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/delete-repairs/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) setRequests(r => r.filter(x => x.id_repair !== id));
    } catch (err) {
      console.error(err);
    }
  };
  const print_ticket = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/ticket/${id}`, {
        method: "GET",
        credentials: "include",
      });
  
      if (res.ok) {
        const blob = await res.blob(); // Get PDF as blob
        const url = window.URL.createObjectURL(blob); // Create a temporary URL
        window.open(url, "_blank");
        const a = document.createElement("a");
        a.href = url;
        a.download = `ticket_${id}.pdf`; // File name
        document.body.appendChild(a);
        a.click(); // Trigger download
        a.remove();
        window.URL.revokeObjectURL(url); // Clean up
      } else {
        console.error("Failed to download ticket");
      }
    } catch (err) {
      console.error(err);
    }
  };
  

  if (authLoading || loading) return <div className="text-center p-6">Loading repair requests...</div>;
  if (error) return <div className="text-red-500 text-center p-6">{error}</div>;

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

          <button
            onClick={() => navigate("/new-request")}
            className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all ml-4"
          >
            + New Repair Request
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-700 text-center">
                  <th className="p-3 border">id_request</th>
                  <th className="p-3 border">Client Name</th>
                  <th className="p-3 border">Phone</th>
                  <th className="p-3 border">Device</th>
                  <th className="p-3 border">Problem</th>
                  <th className="p-3 border">Status</th>
                  <th className="p-3 border">Tracking Number</th>
                  <th className="p-3 border">Entry Date</th>
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
        req.client_username?.toLowerCase().includes(search.toLowerCase())    
      )
      .map((req) => (
        <tr key={req.id_repair} className="hover:bg-gray-100">
          <td className="p-3 border">{req.id_repair}</td>
          <td className="p-3 border">{req.client_username}</td>
          <td className="p-3 border">{req.client_number}</td>
          <td className="p-3 border">{req.device_name}</td>
          <td className="p-3 border">{req.problem_description}</td>
          <td className="p-3 border">
            <span
              className={`px-2 py-1 text-sm font-semibold rounded 
              ${
                req.repair_status === "Not Repaired"
                  ? "bg-red-200 text-red-800"
                  : req.repair_status === "In Progress"
                  ? "bg-yellow-200 text-yellow-800"
                  : "bg-green-200 text-green-800"
              }`}
            >
              {req.repair_status || "Unknown"}
            </span>
          </td>
          <td className="p-3 border">
            {req.tracking_number || "Not specified"}
          </td>
          <td className="p-3 border">
            {req.entry_date
              ? new Date(req.entry_date).toLocaleDateString()
              : "Not specified"}
          </td>
          <td className="p-3 border flex gap-3 justify-center">
            <FiEye
              className="text-blue-500 text-xl cursor-pointer hover:text-blue-700"
              title="View"
              onClick={() => print_ticket(req.id_repair)}
            />
            <FiEdit
              className="text-green-500 text-xl cursor-pointer hover:text-green-700"
              title="Edit"
              onClick={() => navigate(`/edit-request/${req.id_repair}`)}
            />
            <FiTrash2
              className="text-red-500 text-xl cursor-pointer hover:text-red-700"
              title="Delete"
              onClick={() => handleDelete(req.id_repair)}
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
