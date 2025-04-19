import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';
import PDFDocument from 'pdfkit';
import {
  addRepairRequest as modelCreate,
  getRepairDetailsById as modelFetchDetails,
  deleteRepair as modelDelete,
  getRepairDetailsById as modelGetAll
} from '../models/repairModel.js';

// 🎯 إضافة طلب إصلاح + إنشاء PDF
export const createRepairRequest = async (req, res) => {
  try {
    const { client, device } = req.body;
    const id_workshop = req.session.user?.id_workshop;
    if (!id_workshop) return res.status(401).json({ message: 'Not authorized' });

    const newRepair = await modelCreate({
      client,
      device,
      repair: { id_workshop }
    });

    const detailed = await modelFetchDetails(newRepair.id_repair);
    if (!detailed) return res.status(500).json({ message: 'Could not fetch repair details' });

    await generateRepairTicket(detailed);

    const downloadUrl = `${req.protocol}://${req.get('host')}/api/repair/ticket/${detailed.id_repair}`;
    res.status(201).json({ ...detailed, ticketUrl: downloadUrl });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// 🎯 حذف طلب إصلاح
export const deleteRepairRequest = async (req, res) => {
  const { id_repair } = req.params;
  try {
    const deletedRepair = await modelDelete(id_repair);
    if (!deletedRepair) {
      return res.status(404).json({ message: "Repair request not found" });
    }
    res.status(200).json({ message: "Repair request deleted successfully" });
  } catch (error) {
    console.error("Error deleting repair request:", error);
    res.status(500).json({ message: "Error deleting repair request" });
  }
};

// 🎯 جلب جميع الطلبات الخاصة بورشة العمل
export const getRepairsByWorkshop = async (req, res) => {
  const id_workshop = req.session.user?.id_workshop;
  if (!id_workshop) return res.status(401).json({ message: "Not authorized" });

  try {
    const repairs = await modelGetAll(id_workshop);
    res.status(200).json(repairs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🎯 تحميل ملف PDF الخاص بالتذكرة
export const downloadTicket = async (req, res) => {
  const { id_repair } = req.params;
  try {
    const detailed = await modelFetchDetails(id_repair);
    if (!detailed) return res.status(404).json({ message: "Repair not found" });

    const ticketPath = path.join('tickets', `ticket_${id_repair}.pdf`);
    if (!fs.existsSync(ticketPath)) {
      await generateRepairTicket(detailed);
    }
    res.download(ticketPath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// 🎯 توليد ملف التذكرة PDF
const generateRepairTicket = async (repair) => {
  const doc = new PDFDocument();
  const ticketPath = path.join('tickets', `ticket_${repair.id_repair}.pdf`);

  const qrData = `Tracking Number: ${repair.tracking_number}`;
  const qrCode = await QRCode.toDataURL(qrData);

  if (!fs.existsSync('tickets')) fs.mkdirSync('tickets');

  doc.pipe(fs.createWriteStream(ticketPath));

  doc.image(Buffer.from(qrCode.split(",")[1], 'base64'), 450, 20, { width: 100 });
  doc.fontSize(16).text(`Repair Request Ticket`, { align: 'center' });
  doc.moveDown();

  doc.fontSize(12).text(`Tracking Number: ${repair.tracking_number}`);
  doc.text(`Client: ${repair.client_username}`);
  doc.text(`Phone: ${repair.client_number}`);
  doc.text(`Device: ${repair.device_name}`);
  doc.text(`Problem: ${repair.problem_description}`);
  doc.text(`Status: ${repair.repair_status}`);
  doc.text(`Cost: ${repair.repair_cost ? repair.repair_cost + ' DA' : '— DA'}`);
  doc.text(`Entry Date: ${repair.entry_date ? new Date(repair.entry_date).toLocaleDateString() : 'Invalid Date'}`);

  doc.end();
};
