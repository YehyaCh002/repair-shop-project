import { useState } from "react";
import { FiUser, FiPhone, FiMail, FiTool } from "react-icons/fi";
import Sidebar from "/src/components/Sidebar";

const NewRepairRequest = () => {
  const initialForm = {
    client_username:     "",
    client_number:       "",
    client_email:        "",
    device_name:         "",
    problem_description: ""
  };
  const [formData, setFormData] = useState(initialForm);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // build the payload just with client and device
    const payload = {
      client: {
        client_username: formData.client_username,
        client_number:   formData.client_number,
        client_email:    formData.client_email,
      },
      device: {
        device_name:         formData.device_name,
        problem_description: formData.problem_description,
      },
    };

    try {
      const res = await fetch("http://localhost:5000/api/post-repairs", {
        method:      "POST",
        headers:     { "Content-Type": "application/json" },
        credentials: "include",            // send your session cookie
        body:        JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.text();
        return alert("Error: " + err);
      }

      alert("✅ Repair request submitted!");
      setFormData(initialForm);          // clear the form
    } catch (err) {
      console.error(err);
      alert("Network error, see console");
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 bg-gray-100 p-8">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
          <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
            New Repair Request
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                name="client_username"
                value={formData.client_username}
                onChange={handleChange}
                placeholder="Client Username"
                className="w-full h-12 pl-10 border border-gray-300 text-black rounded text-lg"
                required
              />
            </div>
            <div className="relative">
              <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                name="client_number"
                type="tel"
                value={formData.client_number}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full h-12 pl-10 border border-gray-300 text-black rounded text-lg"
                required
              />
            </div>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                name="client_email"
                type="email"
                value={formData.client_email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full h-12 pl-10 border border-gray-300 text-black rounded text-lg"
                required
              />
            </div>
            <div className="relative">
              <FiTool className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                name="device_name"
                value={formData.device_name}
                onChange={handleChange}
                placeholder="Device Name"
                className="w-full h-12 pl-10 border border-gray-300 text-black rounded text-lg"
                required
              />
            </div>
            <textarea
              name="problem_description"
              value={formData.problem_description}
              onChange={handleChange}
              placeholder="Problem Description"
              className="w-full h-24 p-3 border border-gray-300 text-black rounded text-lg"
              required
            />

            <div className="flex justify-end gap-4 mt-4">
              <button
                type="button"
                onClick={() => setFormData(initialForm)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewRepairRequest;
