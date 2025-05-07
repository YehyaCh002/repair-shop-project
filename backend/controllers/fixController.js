import { fetchFixedRepairs, createFixAndReceive } from '../models/fixModel.js';

export const getFixedRepairs = async (req, res) => {
  try {
    const data = await fetchFixedRepairs();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const receiveDevice = async (req, res) => {
  const { id_repair, id_device, id_technicien, cost } = req.body;
  try {
    await createFixAndReceive({ id_repair, id_device, id_technicien, cost });
    res.status(201).json({ message: 'Device received and status updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
