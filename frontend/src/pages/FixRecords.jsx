import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import Sidebar from "../components/Sidebar";
import { FiSearch } from "react-icons/fi";

export default function FixRecords() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (!user?.id_workshop) navigate("/login");
  }, [authLoading, user, navigate]);

  // fetch fix records
  const loadRecords = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/fix/get", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading || !user?.id_workshop) return;
    loadRecords();
  }, [authLoading, user]);

  // handle receive action
  const handleReceive = async (rec) => {
    if (!window.confirm("Mark this device as received?")) return;
    try {
      const payload = {
        id_repair: rec.id_repair,
        id_device: rec.id_device,
        id_technicien: rec.id_technicien,
        cost: rec.cost || 0,
      };
      const res = await fetch("http://localhost:5000/fix/receive", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Receive failed");
      // reload list
      loadRecords();
    } catch (err) {
      console.error(err);
      alert("Could not mark as received: " + err.message);
    }
  };

  if (authLoading || loading) return <div className="text-center p-6">Loading fix records...</div>;
  if (error) return <div className="text-red-500 text-center p-6">{error}</div>;

  return (
    <div className="flex h-screen w-screen">
      <Sidebar />
      <div className="flex-1 p-4 sm:p-6 bg-gray-100 text-black min-h-screen overflow-hidden">
        <div className="relative w-full max-w-md mb-4">
          <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Search fix records..."
            className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded shadow text-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700 text-center">
                <th className="p-3 border">Repair ID</th>
                <th className="p-3 border">Client</th>
                <th className="p-3 border">Device</th>
                <th className="p-3 border">Problem</th>
                <th className="p-3 border">Received Date</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-4">
                    No fix records found.
                  </td>
                </tr>
              ) : (
                records
                  .filter((rec) => rec.client.toLowerCase().includes(search.toLowerCase()))
                  .map((rec) => (
                    <tr key={rec.id_repair} className="hover:bg-gray-100">
                      <td className="p-3 border text-center">{rec.id_repair}</td>
                      <td className="p-3 border">{rec.client}</td>
                      <td className="p-3 border">{rec.device}</td>
                      <td className="p-3 border">{rec.problem_description}</td>
                      <td className="p-3 border text-center">
                        {rec.received_date
                          ? new Date(rec.received_date).toLocaleDateString()
                          : "Not received"}
                      </td>
                      <td className="p-3 border text-center">
                        {!rec.received_date && (
                          <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                            onClick={() => handleReceive(rec)}
                          >
                            Receive
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
