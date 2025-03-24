import pool from "../config/db.js";

export const createWorkshop = async (workshopData) => {
  const { workshop_name, workshop_adresse, workshop_number, repair_specialisation, workshop_gmail,workshop_password, wilaya, commune } = workshopData;

  const result = await pool.query(
    `INSERT INTO Workshop (workshop_name, workshop_adresse, workshop_number, repair_specialisation, workshop_gmail, workshop_password, wilaya, commune)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [workshop_name, workshop_adresse, workshop_number, repair_specialisation, workshop_gmail, workshop_password, wilaya, commune]
  );
  
  return result.rows[0];
};

export const findWorkshopByEmail = async (email) => {
  const result = await pool.query(
    `SELECT * FROM Workshop WHERE workshop_gmail = $1`,
    [email]
  );
  return result.rows[0];
};
