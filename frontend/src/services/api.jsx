export const getRepairsRequest = async () => {
  try {
    const response = await fetch("http://localhost:5000/requests"); //
    if (!response.ok) {
      throw new Error("Failed to fetch repair requests");
    }
    const data = await response.json();
    return data.rows; // ✅ Always extract .rows
  } catch (err) {
    console.error("Error fetching repairs:", err);
    return []; // Return empty array on error
  }
};
