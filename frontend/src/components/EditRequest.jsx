import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiUser, FiPhone, FiTool, FiDollarSign, FiCalendar } from "react-icons/fi";
import Sidebar from "./Sidebar";

const RepairEdit = () => {
  const { id } = useParams(); // Get ID from URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    clientName: "",
    phone: "",
    device: "",
    problem: "",
    cost: "",
    entryDate: "",
    deliveryDate: "",
    status: "",
  });

  useEffect(() => {
    const fetchRepairRequest = async () => {
      try {
        const response = await fetch(`http://localhost:5000/requests/${id}`);
        if (response.ok) {
          const data = await response.json();
  
          setFormData({
            clientName: data.client_name || "",
            phone: data.phone_number || "",
            device: data.device_type || "",
            problem: data.problem_description || "",
            cost: data.cost || "",
            entryDate: data.entry_date ? data.entry_date.split("T")[0] : "",
            deliveryDate: data.delivery_date ? data.delivery_date.split("T")[0] : "",
            status: data.status || "Not Repaired",
          });
        } else {
          console.error("Failed to fetch repair request");
        }
      } catch (error) {
        console.error("Error fetching repair request:", error);
      }
    };
  
    fetchRepairRequest();
  }, [id]);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/requests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Repair request updated successfully!");
        navigate("/"); // Redirect to home after update
      } else {
        alert("Failed to update repair request");
      }
    } catch (error) {
      console.error("Error updating repair request:", error);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex h-screen w-screen">
        <div className="w-full flex bg-gray-100 p-8 ">
          <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl h-full ">
            <h2 className="text-2xl font-semibold text-gray-700 text-center mb-4">
              Edit Repair Request
            </h2>

            <form onSubmit={handleSubmit} className="p-2">
              {/* Client Name */}
              <div className="relative mb-2">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  className="text-black w-full h-12 pl-10 pr-4 border border-gray-300 rounded text-lg"
                  required
                />
              </div>

              {/* Phone */}
              <div className="relative mb-2">
                <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="text-black w-full h-12 pl-10 pr-4 border border-gray-300 rounded text-lg"
                  required
                />
              </div>

              {/* Device */}
              <div className="relative mb-2">
                <FiTool className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  name="device"
                  value={formData.device}
                  onChange={handleChange}
                  className="text-black w-full h-12 pl-10 pr-4 border border-gray-300 rounded text-lg"
                  required
                />
              </div>

              {/* Problem Description */}
              <textarea
                name="problem"
                value={formData.problem}
                onChange={handleChange}
                className="text-black w-full h-24 p-3 border border-gray-300 rounded text-lg"
                required
              />

              {/* Cost */}
              <div className="relative mb-2">
                <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="number"
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                  className="text-black w-full h-12 pl-10 pr-4 border border-gray-300 rounded text-lg"
                />
              </div>

              {/* Entry Date */}
              <div className="relative mb-2">
                <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="date"
                  name="entryDate"
                  value={formData.entryDate}
                  onChange={handleChange}
                  className="text-black w-full h-12 pl-10 pr-4 border border-gray-300 rounded text-lg"
                  required
                />
              </div>

              {/* Delivery Date */}
              <div className="relative mb-4">
                <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="date"
                  name="deliveryDate"
                  value={formData.deliveryDate}
                  onChange={handleChange}
                  className="text-black w-full h-12 pl-10 pr-4 border border-gray-300 rounded text-lg"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-lg text-gray-700">Status:</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="text-black w-full h-12 pl-3 pr-4 border border-gray-300 rounded text-lg"
                  required
                >
                  <option value="Not Repaired">Not Repaired</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Repaired">Repaired</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all"
                  onClick={() => navigate("/")}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all"
                >
                  Update Request
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepairEdit;