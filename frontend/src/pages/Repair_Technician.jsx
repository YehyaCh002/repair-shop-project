// src/pages/RepairTechnicianPage.jsx
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import {  FiSearch } from "react-icons/fi";

export default function RepairTechnicianPage() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const { id_technicien } = useParams(); // ensure route is defined as /repair-technician/:id_technicien
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // redirect if not logged in
  useEffect(() => {
    if (authLoading) return;
    if (!user?.id_workshop) navigate("/login");
  }, [authLoading, user, navigate]);

  // fetch repairs assigned to this technician
  useEffect(() => {
    if (authLoading || !user || !id_technicien) return; // guard against undefined param

    const fetchAssignedRepairs = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `http://localhost:5000/technician/get-repairs-by-tech/${id_technicien}`,
          { credentials: "include" }
        );
        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg || "Failed to fetch assigned repairs");
        }
        const data = await res.json();
        setRecords(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedRepairs();
  }, [authLoading, user, id_technicien]);

  if (authLoading || loading)
    return <div className="text-center p-6">Loading...</div>;
  if (error)
    return (
      <div className="text-red-500 text-center p-6">Error: {error}</div>
    );

  return (
    <div className="flex h-screen w-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 min-h-screen overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-full max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search repairs..."
              className="w-full h-12 pl-10 border border-gray-300 rounded shadow text-lg text-black"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-700 text-center">
                  <th className="p-3 border">Repair ID</th>
                  <th className="p-3 border">Tracking #</th>
                  <th className="p-3 border">Status</th>
                  <th className="p-3 border">Client</th>
                  <th className="p-3 border">Device</th>
                  <th className="p-3 border">Entry Date</th>
                  <th className="p-3 border">Cost</th>
                </tr>
              </thead>
              <tbody>
                {records.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center p-4">
                      No repairs assigned.
                    </td>
                  </tr>
                ) : (
                  records
                    .filter((r) =>
                      r.tracking_number.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((r) => (
                      <tr key={r.id_repair} className="hover:bg-gray-100 text-black text-center">
                        <td className="p-3 border">{r.id_repair}</td>
                        <td className="p-3 border">{r.tracking_number}</td>
                        <td className="p-3 border">{r.repair_status}</td>
                        <td className="p-3 border">{r.client_username}</td>
                        <td className="p-3 border">{r.device_name}</td>
                        <td className="p-3 border">{new Date(r.entry_date).toLocaleDateString()}</td>
                        <td className="p-3 border">{r.cost != null ? `${r.cost} DA` : "—"}</td>
                        
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

