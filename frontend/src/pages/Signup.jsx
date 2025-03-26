import { useState, useEffect } from "react";
import {getAllWilayas, getCommunesByWilayaCode } from "algerian-geo";

export default function Signup() {
  const [formData, setFormData] = useState({
    workshop_name: "",
    owner_email: "",
    workshop_password: "",
    workshop_number: "",
    wilaya: "",
    commune: "",
    workshop_adresse: "",
  });

  const [wilayas, setWilayas] = useState([]);
  const [communes, setCommunes] = useState([]);

  useEffect(() => {
    setWilayas(getAllWilayas()); // Fetch wilayas on mount
  }, []);

  useEffect(() => {
    if (formData.wilaya) {
      setCommunes(getCommunesByWilayaCode(formData.wilaya)); // Fetch communes dynamically
    } else {
      setCommunes([]);
    }
  }, [formData.wilaya]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData); // Debugging
    try {
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    }
  );
      if (response.ok) {
        const result = await response.json();
        console.log("Form Submitted Successfully:", result);
        alert("Workshop registered successfully!");
        setFormData({
          workshop_name: "",
          owner_email: "",
          workshop_password: "",
          workshop_number: "",
          wilaya: "",
          commune: "",
          workshop_addresse: "",
        });
      }
    else {
        alert("Failed to register workshop");
    }
  } catch (error) {
        console.error("Error submitting form:", error);
  };}

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-700 via-indigo-950 to-indigo-900 p-4">
      <div className="relative w-full max-w-[900px]">
        <div className="absolute inset-0 bg-white/20 rounded-2xl shadow-xl -rotate-3 translate-x-2 translate-y-3 backdrop-blur-lg" />

        <form
          onSubmit={handleSubmit}
          className="relative z-10 bg-white p-8 rounded-2xl shadow-lg"
        >
          <h1 className="text-2xl font-bold text-center text-indigo-900 mb-6">
            Workshop Registration
          </h1>

          {/* All Inputs in One Step */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">
                Workshop Name
              </label>
              <input
                type="text"
                name="workshop_name"
                placeholder="Enter workshop name"
                value={formData.workshop_name}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-4 py-2 text-black"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">
                Owner Email
              </label>
              <input
                type="email"
                name="owner_email"
                placeholder="Enter owner email"
                value={formData.owner_email}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-4 py-2 text-black"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-4 py-2 text-black"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone_number"
                placeholder="Enter phone number"
                value={formData.phone_number}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-4 py-2 text-black"
                required
              />
            </div>

            {/* Wilaya Selection */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Wilaya</label>
              <select
                name="wilaya"
                value={formData.wilaya}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-4 py-2 text-black bg-white"
                required
              >
                <option value="">Select wilaya</option>
                {wilayas.map((wilaya) => (
                  <option key={wilaya.code} value={wilaya.code} className="text-black">
                    {wilaya.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Commune Selection */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Commune</label>
              <select
                name="commune"
                value={formData.commune}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-4 py-2 text-black bg-white"
                required
              >
                <option value="">Select commune</option>
                {communes.map((commune) => (
                  <option key={commune.code} value={commune.code} className="text-black">
                    {commune.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Address</label>
              <input
                type="text"
                name="address"
                placeholder="Enter workshop address"
                value={formData.address}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-4 py-2 text-black"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-6 bg-indigo-900 hover:bg-indigo-800 text-white font-semibold py-3 rounded-lg w-full"
          >
            Register Workshop
          </button>
        </form>
      </div>
    </div>
  );
}
