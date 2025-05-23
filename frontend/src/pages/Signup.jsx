import { useState, useEffect } from "react";
import { getAllWilayas, getCommunesByWilayaCode } from "algerian-geo";

export default function Signup() {
  const [formData, setFormData] = useState({
    workshop_name: "",
    workshop_gmail: "",
    workshop_password: "",
    workshop_number: "",
    repair_specialisation: "",
    wilaya: "",
    commune: "",
    workshop_adresse: "",
  });

  const [wilayas, setWilayas] = useState([]);
  const [communes, setCommunes] = useState([]);

  // Load wilayas on mount
  useEffect(() => {
    setWilayas(getAllWilayas());
  }, []);

  // When formData.wilaya (the name) changes, find its code and load corresponding communes.
  useEffect(() => {
    if (formData.wilaya && wilayas.length > 0) {
      const selectedWilaya = wilayas.find(
        (w) => w.name.toLowerCase() === formData.wilaya.trim().toLowerCase()
      );
      if (selectedWilaya) {
        setCommunes(getCommunesByWilayaCode(selectedWilaya.code));
      } else {
        setCommunes([]);
      }
    } else {
      setCommunes([]);
    }
  }, [formData.wilaya, wilayas]);

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
    const all = getAllWilayas();
    console.table(all);
   

    try {
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Form Submitted Successfully:", result);
        alert("Workshop registered successfully!");

        // Reset form
        setFormData({
          workshop_name: "",
          workshop_gmail: "",
          workshop_password: "",
          workshop_number: "",
          repair_specialisation: "",
          wilaya: "",
          commune: "",
          workshop_adresse: "",
        });
      } else {
        const errorData = await response.json();
        alert("Failed to register workshop: " + (errorData.error || "Unknown error"));
        console.error("Error response:", errorData);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-700 via-indigo-950 to-indigo-900 p-4">
      <div className="relative w-full max-w-[900px]">
        <div className="absolute inset-0 bg-white/20 rounded-2xl shadow-xl -rotate-3 translate-x-2 translate-y-3 backdrop-blur-lg" />

        <form onSubmit={handleSubmit} className="relative z-10 bg-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold text-center text-indigo-900 mb-6">Workshop Registration</h1>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Workshop Name", name: "workshop_name", type: "text" },
              { label: "Owner Email", name: "workshop_gmail", type: "email" },
              { label: "Password", name: "workshop_password", type: "password" },
              { label: "Phone Number", name: "workshop_number", type: "tel" },
      
              { label: "Address", name: "workshop_adresse", type: "text" },
            ].map(({ label, name, type }) => (
              <div key={name} className="flex flex-col">
                <label className="text-gray-700 font-medium mb-1">{label}</label>
                <input
                  type={type}
                  name={name}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  value={formData[name]}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-black"
                  required
                />
              </div>
            ))}
          </div>
            {/* Specialization Selection */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Repair Specialization</label>
              <select
                name="repair_specialisation"
                value={formData.repair_specialisation}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-4 py-2 text-black bg-white"
                required
              >
                <option value="">Select specialization</option>
                <option value="Phone and Tablets">Phone and Tablets</option>
                <option value="Laptops and Desktops">Laptops and Desktops</option>
                <option value="Printers">Printers</option>
                <option value="Cars">Cars</option>
              </select>
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
                  // Use the name as the value so backend receives a name
                  <option key={wilaya.code} value={wilaya.name} className="text-black">
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
                  // Use the name as the value so backend receives a name
                  <option key={commune.code} value={commune.name} className="text-black">
                    {commune.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Submit Button */}
          <button type="submit" className="mt-6 bg-indigo-900 hover:bg-indigo-800 text-white font-semibold py-3 rounded-lg w-full">
            Register Workshop
          </button>
        </form>
      </div>
    </div>
  );
}
