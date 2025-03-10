import { useState } from "react";
import { FiUser, FiPhone, FiTool, FiDollarSign, FiCalendar } from "react-icons/fi";
import Sidebar from "/src/components/Sidebar";

const NewRepairRequest = () => {
  const [formData, setFormData] = useState({
    clientName: "",
    phone: "",
    device: "",
    problem: "",
    cost: "",
    entryDate: "",
    deliveryDate: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:5000/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log("Form Submitted Successfully:", result);
        alert("Repair request submitted!");
        setFormData({
          clientName: "",
          phone: "",
          device: "",
          problem: "",
          cost: "",
          entryDate: "",
        });
      } else {
        alert("Failed to submit request");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  

  return (
    <div className="flex h-screen ">
      {/* Sidebar */}
      <Sidebar />
      <div className=" flex h-screen w-screen ">
      {/* Form Section */}
      <div className=" w-full flex  bg-gray-100 p-8">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
          <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
            New Repair Request
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Client Name */}
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                name="clientName"
                placeholder="Client Name"
                value={formData.clientName}
                onChange={handleChange}
                className="text-black w-full h-12 pl-10 pr-4 border border-gray-300 rounded text-lg"
                required
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="text-black w-full h-12 pl-10 pr-4 border border-gray-300 rounded text-lg"
                required
              />
            </div>

            {/* Device */}
            <div className="relative">
              <FiTool className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                name="device"
                placeholder="Device Type"
                value={formData.device}
                onChange={handleChange}
                className="text-black w-full h-12 pl-10 pr-4 border border-gray-300 rounded text-lg"
                required
              />
            </div>

            {/* Problem Description */}
            <textarea
              name="problem"
              placeholder="Problem Description"
              value={formData.problem}
              onChange={handleChange}
              className="text-black w-full h-24 p-3 border border-gray-300 rounded text-lg"
              required
            />

            {/* Cost */}
            <div className="relative">
              <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="number"
                name="cost"
                placeholder="Estimated Cost ($)"
                value={formData.cost}
                onChange={handleChange}
                className="text-black w-full h-12 pl-10 pr-4 border border-gray-300 rounded text-lg"
               
              />
            </div>

            {/* Entry Date */}
            <div className="relative">
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

            
            {/* Buttons */}
            <div className="flex justify-between mt-4">
              <button
                type="button"
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default NewRepairRequest;
