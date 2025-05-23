import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { FiEdit, FiTrash2, FiEye, FiSearch } from "react-icons/fi";

export default function TechniciansPage() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [technicians, setTechnicians] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // redirect if not logged in
  useEffect(() => {
    if (authLoading) return;
    if (!user?.id_workshop) {
      navigate("/login");
    }
  }, [authLoading, user, navigate]);

  // fetch technicians
  useEffect(() => {
    if (authLoading || !user) return;

    const fetchTechnicians = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          "http://localhost:5000/technician/get-technician",
          {
            credentials: "include",
          }
        );
        if (!res.ok) throw new Error("Failed to fetch technicians");
        const data = await res.json();
        setTechnicians(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTechnicians();
  }, [authLoading, user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this technician?")) return;
    try {
      const res = await fetch(
        `http://localhost:5000/technician/delete-technician/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Delete failed");
      }
      setTechnicians((prev) => prev.filter((t) => t.id_technicien !== id));
    } catch (err) {
      console.error("Error deleting technician:", err);
      alert(err.message);
    }
  };

  if (authLoading || loading) return <div className="text-center p-6">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-6">Error: {error}</div>;

  return (
    <div className="flex h-screen w-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 min-h-screen overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-full max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search technicians..."
              className="w-full h-12 pl-10 border border-gray-300 rounded shadow text-lg text-black"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Link to="/new-technician">
            <button className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all ml-4">
              + New Technician
            </button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-700 text-center">
                  <th className="p-3 border">Name</th>
                  <th className="p-3 border">Phone</th>
                  <th className="p-3 border">Expertise</th>
                  <th className="p-3 border">Work Time</th>
                  <th className="p-3 border">Email</th>
                  <th className="p-3 border">Status</th>
                  <th className="p-3 border">Hire Date</th>
                  <th className="p-3 border">Repairs Assigned</th>
                  <th className="p-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {technicians.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center p-4">
                      No technicians found.
                    </td>
                  </tr>
                ) : (
                  technicians
                    .filter((tech) =>
                      tech.technicien_name.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((tech) => (
                      <tr key={tech.id_technicien} className="hover:bg-gray-100 text-black">
                        <td className="p-3 border">{tech.technicien_name}</td>
                        <td className="p-3 border">{tech.technicien_number}</td>
                        <td className="p-3 border">{tech.expertise}</td>
                        <td className="p-3 border">{tech.worktime}</td>
                        <td className="p-3 border">{tech.technicien_gmail}</td>
                        <td className="p-3 border">{tech.technicien_status}</td>
                        <td className="p-3 border">
                          {new Date(tech.hire_date).toLocaleDateString()}
                        </td>
                        <td className="p-3 border text-center">
                          {tech.repair_count}
                        </td>
                        <td className="p-3 border flex gap-3 justify-center">
                          <FiEye
                            className="text-blue-500 text-xl cursor-pointer hover:text-blue-700"
                            title="View"
                            onClick={() => navigate(`/repair-technician/${tech.id_technicien}`)}
                          />
                          <FiEdit
                            className="text-green-500 text-xl cursor-pointer hover:text-green-700"
                            title="Edit"
                            onClick={() => navigate(`/edit-technician/${tech.id_technicien}`)}
                          />
                          <FiTrash2
                            className="text-red-500 text-xl cursor-pointer hover:text-red-700"
                            title="Delete"
                            onClick={() => handleDelete(tech.id_technicien)}
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
