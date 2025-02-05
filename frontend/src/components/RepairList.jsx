import { useState } from "react";

const RepairList = () => {
  const [repairs, setRepairs] = useState([
    { id: 1, name: "Screen Repair", description: "Fix cracked screen", cost: 100, status: "Pending" },
    { id: 2, name: "Battery Replacement", description: "Replace battery", cost: 50, status: "Completed" },
  ]);
  const [newRepair, setNewRepair] = useState({
    name: "",
    description: "",
    cost: "",
    status: "Pending",
  });

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRepair((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle submitting the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send POST request to backend to add new repair
    try {
      const response = await fetch("http://localhost:5000/repairs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRepair), // Convert the new repair object to JSON
      });

      const addedRepair = await response.json(); // Parse the JSON response

      // Update the state with the new repair
      setRepairs((prevRepairs) => [...prevRepairs, addedRepair]);

      // Reset the form after submission
      setNewRepair({
        name: "",
        description: "",
        cost: "",
        status: "Pending",
      });
    } catch (err) {
      console.error("Error adding new repair:", err);
    }
  };

  return (
    <div>
      <h1>Repair List</h1>
      <table>
        <thead>
          <tr>
            <th>Repair ID</th>
            <th>Repair Name</th>
            <th>Repair Description</th>
            <th>Repair Cost</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {repairs.map((repair) => (
            <tr key={repair.id}>
              <td>{repair.id}</td>
              <td>{repair.name}</td>
              <td>{repair.description}</td>
              <td>{repair.cost}</td>
              <td>{repair.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Form to add new repair */}
      <h2>Add New Repair</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={newRepair.name}
          onChange={handleInputChange}
          placeholder="Repair Name"
          required
        />
        <input
          type="text"
          name="description"
          value={newRepair.description}
          onChange={handleInputChange}
          placeholder="Repair Description"
          required
        />
        <input
          type="number"
          name="cost"
          value={newRepair.cost}
          onChange={handleInputChange}
          placeholder="Repair Cost"
          required
        />
        <select
          name="status"
          value={newRepair.status}
          onChange={handleInputChange}
        >
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
        <button type="submit">Add Repair</button>
      </form>
    </div>
  );
};

export default RepairList;
