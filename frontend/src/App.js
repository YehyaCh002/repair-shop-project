import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch("http://localhost:5000/")  // Calls the Express backend
      .then((res) => res.text())     // Convert response to text
      .then((data) => setMessage(data))  // Set the received message
      .catch((err) => console.error("Error:", err));
  }, []);

  return (
    <div>
      <h1>Frontend Connected to Backend</h1>
      <p>Message from backend: {message}</p>
    </div>
  );
}

export default App;
