import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";


export default function Home() {
  const [background] = useState("/computerrepair.png");
  const [loaded, setLoaded] = useState(false);
  const [tracking, setTracking] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const img = new Image();
    img.src = background;
    img.onload = () => setLoaded(true);
  }, [background]);

  const downloadTicket = async (trackingNumber) => {
    try {
      setLoading(true);
      setError(""); // Reset error state

      const response = await fetch(
        `http://localhost:5000/api/ticket-by-tracking/${trackingNumber}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${trackingNumber}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        setError("Ticket not found or server error.");
        console.error("Failed to download ticket");
      }
    } catch (error) {
      setError("Network error occurred while downloading the ticket.");
      console.error("Error downloading ticket:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (tracking.trim()) {
      await downloadTicket(tracking.trim());
    } else {
      setError("Please enter a tracking number.");
    }
  };


  return (
    <div
      className={`h-screen w-screen bg-cover bg-center flex flex-col items-center justify-center transition-all duration-1000 transform ${
        loaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
      }`}
      style={{ backgroundImage: `url(${background})` }}
    >
      <NavBar />

      <div className="text-center pointer-events-none">
        <h2 className="text-5xl font-extrabold mb-4 text-white/90">
          Get Help With Your Device
        </h2>
      </div>
      <div className="flex justify-center items-center mb-6 gap-2 z-10">
        <input
          value={tracking}
          onChange={(e) => setTracking(e.target.value)}
          type="text"
          placeholder="Enter your tracking number"
          className="text-lg bg-amber-50 text-black pl-3 pr-24 py-4 rounded-lg hover:bg-indigo-100 transition focus:outline-none"
        />
        <button
          onClick={handleSearch}
          className="bg-indigo-500 hover:bg-indigo-600 text-xl text-white px-6 py-4 rounded-lg shadow-lg transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}

     
    </div>
  );
}

