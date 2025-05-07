import {
  getTechniciansByWorkshop,
  insertTechnician,
  linkTechnicianToWorkshop,
  deletedTechnician,
  updateTechnician,
  getTechnicianByID,
} from '../models/technicianModel.js';

export const fetchTechniciansByWorkshop = async (req, res) => {
  const workshopId = req.session.user?.id_workshop;
  if (!workshopId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const techs = await getTechniciansByWorkshop(workshopId);
    return res.json(techs);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const createTechnician = async (req, res) => {
  const workshopId = req.session.user?.id_workshop;
  if (!workshopId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const techData = req.body;
  try {
    const techId = await insertTechnician(techData);
    await linkTechnicianToWorkshop(workshopId, techId);
    return res.status(201).json({ message: 'Added', id_technicien: techId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deleteTechnician = async (req, res) => {
  const { id_technicien } = req.params;

  try {
    const wasDeleted = await deletedTechnician(id_technicien);
    if (!wasDeleted) {
      return res.status(404).json({ message: 'Technician not found' });
    }
    return res.status(200).json({ message: 'Technician deleted successfully' });
  } catch (error) {
    console.error('Error deleting technician:', error);
    return res.status(500).json({ message: 'Error deleting technician' });
  }
};


export const updateTech = async (req, res) => {
  const workshopId   = req.session.user?.id_workshop;
  const { id_technicien } = req.params;
  const updateData   = req.body;

  if (!workshopId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const updated = await updateTechnician(id_technicien, updateData);
    if (!updated) {
      return res.status(404).json({ message: 'Technician not found' });
    }
    return res.status(200).json(updated);
  } catch (err) {
    console.error('Error updating technician:', err.message);
    return res.status(500).json({ message: 'Error updating technician' });
  }
};
export const getOneTechnician = async (req, res) => {
  const workshopId    = req.session.user?.id_workshop;

  const { id_technicien } = req.params;

  if (!workshopId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const technician = await getTechnicianByID(workshopId, id_technicien);
    if (!technician) {
      return res.status(404).json({ message: 'Technician not found' });
    }
    return res.status(200).json(technician);
  } catch (err) {
    console.error('Error fetching technician:', err);
    return res.status(500).json({ message: err.message });
  }
};
