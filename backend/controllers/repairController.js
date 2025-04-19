import {
  addRepairRequest as modelCreate,
  getRepairsbyWorkshop as modelFetch,
  deleteRepair as modelDelete,
} from '../models/repairModel.js';

export const createRepairRequest = async (req, res) => {
  try {
    const { client, device } = req.body;
    const workshopId = req.session.user.id_workshop;
    if (!workshopId) return res.status(401).json({ message: "Not authorized" });

    const newRepair = await modelCreate({
      client,
      device,
      repair: { id_workshop: workshopId }
    });
    console.log("New Repair Request:", newRepair);
    res.status(201).json(newRepair);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRepairsByWorkshop = async (req, res) => {
  const workshopId = req.session.user.id_workshop;
  if (!workshopId) return res.status(401).json({ message: "Not authorized" });

  try {
    const repairs = await modelFetch(workshopId);
    res.status(200).json(repairs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteRepairRequest = async (req, res) => {

const { id_repair } = req.params;

try {
  const deletedRepair = await modelDelete(id_repair);
  if (!deletedRepair) {
    return res.status(404).json({ message: "Repair request not found" });
  }
  res.status(200).json({ message: "Repair request deleted successfully" })

}
catch (error) {
  console.error("Error deleting repair request:", error);
  res.status(500).json({ message: "Error deleting repair request" });
}

}