import { getTechniciansByWorkshop, insertTechnician, linkTechnicianToWorkshop,deletedTechnician } from '../models/technicianModel.js';

export const fetchTechniciansByWorkshop = async (req, res) => {
  const workshopId = req.session.user.id_workshop;
  if (!workshopId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const techs = await getTechniciansByWorkshop(workshopId);
    res.json(techs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createTechnician = async (req, res) => {
  const workshopId = req.session.user.id_workshop;
  if (!workshopId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const techData = req.body;
  try {
    const techId = await insertTechnician(techData);
    await linkTechnicianToWorkshop(workshopId, techId);
    res.status(201).json({ message: 'Added', id_technicien: techId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
export const deleteTechnician = async (req, res) => {

const { id_technicien } = req.params;

try {
  const deletedTechnicien = await deletedTechnician(id_technicien);
  if (!deletedTechnicien) {
    return res.status(404).json({ message: "Technician not found" });
  }
  res.status(200).json({ message: "Technician deleted successfully" })

}
catch (error) {
  console.error("Error deleting technician:", error);
  res.status(500).json({ message: "Error deleting technician" });
}

}