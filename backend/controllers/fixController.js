import { fetchFixedRepairs, createFixAndReceive } from '../models/fixModel.js';

export const getFixedRepairs = async (req, res) => {
  const workshopId = req.session.user?.id_workshop;
  if (!workshopId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const data = await fetchFixedRepairs(workshopId);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const receiveDevice = async (req, res) => {
  const { id_repair, id_device, id_technicien, cost } = req.body;
  if (!id_repair || !id_device || !id_technicien) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    await createFixAndReceive({ id_repair, id_device, id_technicien, cost });
    res.status(201).json({ message: 'Device received and status updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
