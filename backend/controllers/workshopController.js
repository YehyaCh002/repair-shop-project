import { getWorkshopSettings, updateWorkshopSettings } from '../models/workshopModel.js';

export const getSettings = async (req, res) => {
  try {
    const id_workshop = req.session.user?.id_workshop;
    const settings = await getWorkshopSettings(id_workshop);
    if (!settings) return res.status(404).json({ message: 'Workshop not found' });
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const id_workshop = req.session.user?.id_workshop;
    const updated = await updateWorkshopSettings(id_workshop, req.body);
    if (!updated) return res.status(400).json({ message: 'No fields to update' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
