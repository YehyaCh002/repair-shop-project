import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

export default function Login() {
  const [formData, setFormData] = useState({
    workshop_gmail: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.workshop_gmail)) {
      setLoading(false);
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // مهم جداً لتفعيل الجلسة
      });

      const data = await response.json();
      console.log("Login Response:", data); 

      if (response.ok && data.workshop) {
        login(data.workshop); // نسجل الوركشوب في الـ context
        navigate("/repair-requests");
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (error) {
      setError(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-700 via-indigo-950 to-indigo-900 p-4">
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 bg-white/20 rounded-2xl shadow-xl -rotate-3 translate-x-2 translate-y-3 backdrop-blur-lg" />
        <form
          onSubmit={handleSubmit}
          className="relative z-10 bg-white p-8 rounded-2xl shadow-lg"
        >
          <h1 className="text-2xl font-bold text-center text-indigo-900 mb-6">
            Login
          </h1>

          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

          <div className="flex flex-col mb-4">
            <label className="text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="workshop_gmail"
              placeholder="Enter your email"
              value={formData.workshop_gmail}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 text-black"
              required
            />
          </div>

          <div className="flex flex-col mb-4">
            <label className="text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 text-black"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-6 bg-indigo-900 hover:bg-indigo-800 text-white font-semibold py-3 rounded-lg w-full"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
