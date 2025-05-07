import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiPhone,
  FiMail,
  FiTool,
  FiClock
} from "react-icons/fi";
import Sidebar from "../components/Sidebar";

export default function EditTechnician() {
  const { id_technicien } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    technicien_name: "",
    technicien_number: "",
    technicien_gmail: "",
    expertise: "",
    worktime: "",
    technicien_status: "Active",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/technician/get-technician-byID/${id_technicien}`, {
      credentials: "include",
    })
      .then(res => {
        if (!res.ok) throw new Error(`Fetch failed (${res.status})`);
        return res.json();
      })
      .then(data => {
        setFormData({
          technicien_name: data.technicien_name || "",
          technicien_number: data.technicien_number || "",
          technicien_gmail: data.technicien_gmail || "",
          expertise: data.expertise || "",
          worktime: data.worktime || "",
          technicien_status: data.technicien_status || "Active",
        });
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id_technicien]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:5000/technician/update-technician/${id_technicien}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Update failed (${res.status})`);
      }
      navigate("/technicians");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="text-center p-6">Loading…</div>;
  if (error) return <div className="text-red-500 p-6 text-center">{error}</div>;

  return (
    <div className="flex h-screen w-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-100 p-6 overflow-auto">
        <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 text-center text-black">
            Edit Technician
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                name="technicien_name"
                value={formData.technicien_name}
                onChange={handleChange}
                placeholder="Name"
                required
                className="w-full h-12 pl-10 border border-black rounded text-black text-lg"
              />
            </div>

            <div className="relative">
              <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                name="technicien_number"
                value={formData.technicien_number}
                onChange={handleChange}
                placeholder="Phone"
                required
                className="w-full h-12 pl-10 border border-black rounded text-black text-lg"
              />
            </div>

            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="technicien_gmail"
                value={formData.technicien_gmail}
                onChange={handleChange}
                placeholder="Email"
                required
                className="w-full h-12 pl-10 border border-black rounded text-black text-lg"
              />
            </div>

            <div className="relative">
              <FiTool className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                name="expertise"
                value={formData.expertise}
                onChange={handleChange}
                placeholder="Expertise"
                className="w-full h-12 pl-10 border border-black rounded text-black text-lg"
              />
            </div>

            <div className="relative">
              <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                name="worktime"
                value={formData.worktime}
                onChange={handleChange}
                placeholder="Work Time"
                className="w-full h-12 pl-10 border border-black rounded text-black text-lg"
              />
            </div>

            <div>
              <label className="block mb-1 text-lg text-black">Status:</label>
              <select
                name="technicien_status"
                value={formData.technicien_status}
                onChange={handleChange}
                required
                className="w-full h-12 pl-3 border border-black rounded text-black text-lg"
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded-lg transition-all"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
