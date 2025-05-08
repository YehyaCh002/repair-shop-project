import os from 'os';
import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';
import PDFDocument from 'pdfkit';
import {
  addRepairRequest   as modelCreate,
  getRepairDetailsById as modelFetchDetails,
  getRepairsByWorkshop as modelGetAll,
  deleteRepair         as modelDelete,
  updateRepair         as modelUpdate,
  getRepairById        as modelGetone,
  getRepairByTrackingNumber  as modelGetByTracking
} from '../models/repairModel.js';

function getLocalIp() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return '127.0.0.1';
}

export const createRepairRequest = async (req, res) => {
  try {
    const { client, device } = req.body;
    const id_workshop = req.session.user?.id_workshop;
    if (!id_workshop) return res.status(401).json({ message: 'Not authorized' });

    const newRepair = await modelCreate({ client, device, repair: { id_workshop } });
    const detailed  = await modelFetchDetails(newRepair.id_repair);
    if (!detailed) return res.status(500).json({ message: 'Could not fetch repair details' });

    const serverIp    = getLocalIp();
    const downloadUrl = `http://${serverIp}:5000/api/repair/ticket/${detailed.id_repair}`;

    await generateRepairTicket(detailed, downloadUrl);

    return res.status(201).json({ ...detailed, ticketUrl: downloadUrl });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

export const getRepairsByWorkshop = async (req, res) => {
  const id_workshop = req.session.user?.id_workshop;
  if (!id_workshop) return res.status(401).json({ message: 'Not authorized' });

  try {
    const repairs = await modelGetAll(id_workshop);
    return res.status(200).json(repairs);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

export const deleteRepairRequest = async (req, res) => {
  const { id_repair } = req.params;
  try {
    const deleted = await modelDelete(id_repair);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    return res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

export const getOneRequest = async (req, res) => {
  const { id_repair } = req.params;
  try {
    const repair = await modelGetone(id_repair);
    if (!repair) return res.status(404).json({ message: 'Not found' });
    return res.status(200).json(repair);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

export const updateRepairRequest = async (req, res) => {
  const { id_repair } = req.params;
  const { repair_status, tracking_number, cost } = req.body;
  try {
    const updated = await modelUpdate(id_repair, { repair_status, tracking_number, cost });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    return res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

export const downloadTicket = async (req, res) => {
  const { id_repair } = req.params;
  const detailed = await modelFetchDetails(id_repair);
  if (!detailed) return res.status(404).json({ message: 'Not found' });

  const ticketDir  = path.join(process.cwd(), 'tickets');
  const ticketPath = path.join(ticketDir, `ticket_${detailed.id_repair}.pdf`);
  if (!fs.existsSync(ticketDir)) fs.mkdirSync(ticketDir);

  const serverIp    = getLocalIp();
  const downloadUrl = `http://${serverIp}:5000/api/repair/ticket/${detailed.id_repair}`;
  await generateRepairTicket(detailed, downloadUrl);

  return res.download(ticketPath, `ticket_${detailed.id_repair}.pdf`, err => {
    if (err) console.error('Download error:', err);
  });
};

export const downloadTicketByTracking = async (req, res) => {
  const { tracking_number } = req.params;
  const detailed = await modelGetByTracking(tracking_number);
  if (!detailed) return res.status(404).json({ message: 'Not found' });

  const ticketDir  = path.join(process.cwd(), 'tickets');
  const ticketPath = path.join(ticketDir, `ticket_${detailed.id_repair}.pdf`);
  if (!fs.existsSync(ticketDir)) fs.mkdirSync(ticketDir);

  const serverIp    = getLocalIp();
  const downloadUrl = `http://${serverIp}:5000/api/repair/ticket/${tracking_number}`;
  await generateRepairTicket(detailed, downloadUrl);

  return res.download(ticketPath, `ticket_${tracking_number}.pdf`, err => {
    if (err) console.error('Download error:', err);
  });
};

const generateRepairTicket = (repair, qrDataUrl) => {
  return new Promise(async (resolve, reject) => {
    try {
      const ticketDir = path.join(process.cwd(), 'tickets');
      if (!fs.existsSync(ticketDir)) fs.mkdirSync(ticketDir);

      const ticketPath = path.join(ticketDir, `ticket_${repair.id_repair}.pdf`);
      const doc = new PDFDocument();
      const out = fs.createWriteStream(ticketPath);
      doc.pipe(out);

      const qr = await QRCode.toDataURL(qrDataUrl);
      doc.image(Buffer.from(qr.split(',')[1], 'base64'), 450, 20, { width: 100 });

      doc.fontSize(16).text('Repair Request Ticket', { align: 'center' }).moveDown();
      const lines = [
        `Tracking Number: ${repair.tracking_number}`,
        `Client:         ${repair.client_username}`,
        `Phone:          ${repair.client_number}`,
        `Device:         ${repair.device_name}`,
        `Problem:        ${repair.problem_description}`,
        `Entry Date:     ${new Date(repair.entry_date).toLocaleDateString()}`
      ];
      lines.forEach(line => doc.fontSize(12).text(line).moveDown());

      doc.fontSize(12).text(`Status:         ${repair.repair_status}`).moveDown();
      if (repair.repair_status === 'Repaired' && repair.cost != null) {
        doc.fontSize(12).text(`Cost:           ${repair.cost} DA`).moveDown();
      }

      doc.end();
      out.on('finish', () => resolve());
      out.on('error', err => reject(err));
    } catch (err) {
      reject(err);
    }
  });
};
