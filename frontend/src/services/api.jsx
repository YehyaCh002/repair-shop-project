export async function getRepairsRequest() {
  try {
    const response = await fetch("http://localhost:5000/api/get-repairs/1");
    const data = await response.json();
    console.log("Fetched Data from API:", data); // Ensure this logs correctly
    return data;
  } catch (error) {
    console.error("Error fetching repair requests:", error);
    return [];
  }
}

export async function getTechnicians() {
  try {
    const response = await fetch("http://localhost:5000/technicians");
    const data = await response.json();
    console.log("Fetched Data from API:", data); // Ensure this logs correctly
    return data;
  } catch (error) {
    console.error("Error fetching technicians:", error);
    return [];
  }
}
