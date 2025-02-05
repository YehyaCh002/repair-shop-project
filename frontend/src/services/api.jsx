// services/api.js

// GET: Fetch repairs from the backend
export const getRepairs_request = async () => {
    try {
      const response = await fetch("http://localhost:5000/repairs");
      return { data: await response.json() }; // Return data in the same structure
    } catch (err) {
      console.error("Error fetching repairs", err);
      return { data: [] }; // Return empty array if there's an error
    }
  };
  
  // POST: Add a new repair to the backend
  export const addRepair_request = async (repairData) => {
    try {
      const response = await fetch("http://localhost:5000/repairs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(repairData),
      });
      return await response.json(); // Return the added repair data
    } catch (err) {
      console.error("Error adding repair", err);
    }
  };
  
  // DELETE: Delete a repair by ID
  export const deleteRepair_request = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/repairs/${id}`, {
        method: "DELETE",
      });
      return await response.json(); // Return a confirmation message
    } catch (err) {
      console.error("Error deleting repair", err);
    }
  };
  