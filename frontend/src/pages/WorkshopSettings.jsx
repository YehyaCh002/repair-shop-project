import { useState, useEffect } from "react";
import Sidebar from "/src/components/Sidebar";

export default function WorkshopSettings () {
  const [formData, setFormData] = useState({
    workshop_name: "",
    workshop_adresse: "",
    workshop_number: "",
    repair_specialisation: "",
    workshop_gmail: "",
    commune: "",
    wilaya: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch current workshop settings
    fetch("http://localhost:5000/workshop/settings", {
      credentials: "include",
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch settings");
        return res.json();
      })
      .then(data => {
        setFormData({
          workshop_name: data.workshop_name || "",
          workshop_adresse: data.workshop_adresse || "",
          workshop_number: data.workshop_number || "",
          repair_specialisation: data.repair_specialisation || "",
          workshop_gmail: data.workshop_gmail || "",
          commune: data.commune || "",
          wilaya: data.wilaya || "",
          password: "",
        });
      })
      .catch(err => setMessage("❌ " + err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData };
    try {
      const res = await fetch("http://localhost:5000/workshop/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }
      alert("✔️ Settings updated successfully");
    } catch (err) {
      console.error(err);
      alert("❌ " + err.message);
    }
  };

  if (loading) return <div className="flex-1 p-8">Loading...</div>;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 bg-gray-100 p-8">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
          <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
            Workshop Settings
          </h2>
          {message && <p className="mb-4 text-center">{message}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="workshop_name"
              value={formData.workshop_name}
              onChange={handleChange}
              placeholder="Workshop Name"
              className="w-full h-12 pl-4 border border-gray-300 text-black rounded text-lg"
              required
            />
            <textarea
              name="workshop_adresse"
              value={formData.workshop_adresse}
              onChange={handleChange}
              placeholder="Address"
              className="w-full h-20 p-3 border border-gray-300 text-black rounded text-lg"
              required
            />
            <input
              name="workshop_number"
              type="tel"
              value={formData.workshop_number}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full h-12 pl-4 border border-gray-300 text-black rounded text-lg"
              required
            />
            <input
              name="workshop_gmail"
              type="email"
              value={formData.workshop_gmail}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full h-12 pl-4 border border-gray-300 text-black rounded text-lg"
              required
            />
            <input
              name="repair_specialisation"
              value={formData.repair_specialisation}
              onChange={handleChange}
              placeholder="Specialisation"
              className="w-full h-12 pl-4 border border-gray-300 text-black rounded text-lg"
            />
            <div className="flex gap-4">
              <input
                name="wilaya"
                value={formData.wilaya}
                onChange={handleChange}
                placeholder="Wilaya"
                className="flex-1 h-12 pl-4 border border-gray-300 text-black rounded text-lg"
              />
              <input
                name="commune"
                value={formData.commune}
                onChange={handleChange}
                placeholder="Commune"
                className="flex-1 h-12 pl-4 border border-gray-300 text-black rounded text-lg"
              />
            </div>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="New Password (leave blank to keep current)"
              className="w-full h-12 pl-4 border border-gray-300 text-black rounded text-lg"
            />
            <div className="flex justify-end gap-4 mt-4">
              <button
                type="reset"
                onClick={() => setFormData({
                  workshop_name: "",
                  workshop_adresse: "",
                  workshop_number: "",
                  repair_specialisation: "",
                  workshop_gmail: "",
                  commune: "",
                  wilaya: "",
                  password: "",
                })}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
