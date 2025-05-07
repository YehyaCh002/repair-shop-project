import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiCalendar, FiTag, FiUser, FiPhone, FiTool } from "react-icons/fi";
import Sidebar from "../components/Sidebar";

export default function EditRequest() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    client_username: "",
    client_number: "",
    device_name: "",
    problem_description: "",
    tracking_number: "",
    entry_date: "",
    repair_status: "Not Repaired",
    cost: ""
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/api/get-repairs/${id}`, {
      credentials: "include",
    })
      .then(res => {
        if (!res.ok) throw new Error(`Fetch failed (${res.status})`);
        return res.json();
      })
      .then(data => {
        setFormData({
          client_username: data.client_username || "",
          client_number: data.client_number || "",
          device_name: data.device_name || "",
          problem_description: data.problem_description || "",
          tracking_number: data.tracking_number || "",
          entry_date: data.entry_date ? data.entry_date.split("T")[0] : "",
          repair_status: data.repair_status || "Not Repaired",
          cost: ""
        });
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (formData.repair_status !== "Repaired") {
        delete payload.cost;
      } else {
        payload.cost = Number(formData.cost) || 0;
      }
      const res = await fetch(`http://localhost:5000/api/update-repairs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Update failed (${res.status})`);
      }
      alert("Repair updated successfully");
      navigate(-1);
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
          <h2 className="text-2xl font-semibold mb-4 text-center">Edit Repair Request</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Editable fields */}
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                name="client_username"
                value={formData.client_username}
                onChange={handleChange}
                placeholder="Client Name"
                required
                className="w-full h-12 pl-10 border border-gray-300 rounded text-black text-lg"
              />
            </div>

            <div className="relative">
              <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                name="client_number"
                value={formData.client_number}
                onChange={handleChange}
                placeholder="Phone Number"
                required
                className="w-full h-12 pl-10 border border-gray-300 rounded text-black text-lg"
              />
            </div>

            <div className="relative">
              <FiTool className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                name="device_name"
                value={formData.device_name}
                onChange={handleChange}
                placeholder="Device Name"
                required
                className="w-full h-12 pl-10 border border-gray-300 rounded text-black text-lg"
              />
            </div>

            <textarea
              name="problem_description"
              value={formData.problem_description}
              onChange={handleChange}
              placeholder="Problem Description"
              required
              className="w-full h-24 p-3 border border-gray-300 rounded text-black text-lg"
            />

            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                name="entry_date"
                value={formData.entry_date}
                onChange={handleChange}
                required
                className="w-full h-12 pl-10 border border-gray-300 rounded text-black text-lg"
              />
            </div>

            <div className="relative">
              <FiTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                name="tracking_number"
                value={formData.tracking_number}
                onChange={handleChange}
                placeholder="Tracking Number"
                className="w-full h-12 pl-10 border border-gray-300 rounded text-black text-lg"
              />
            </div>

            {/* Status selector */}
            <div>
              <label className="block mb-1 text-lg text-black">Status:</label>
              <select
                name="repair_status"
                value={formData.repair_status}
                onChange={handleChange}
                required
                className="w-full h-12 pl-3 border border-gray-300 rounded text-black text-lg"
              >
                <option>Not Repaired</option>
                <option>In Progress</option>
                <option>Repaired</option>
              </select>
            </div>

            {/* Cost input only when Repaired */}
            {formData.repair_status === "Repaired" && (
              <div className="relative">
                <FiTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                  placeholder="Repair Cost"
                  required
                  className="w-full h-12 pl-10 border border-gray-300 rounded text-black text-lg"
                />
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
              >Cancel</button>
              <button
                type="submit"
                className="bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded"
              >Update</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
