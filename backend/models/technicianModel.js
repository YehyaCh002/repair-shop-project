import pool from '../config/db.js'

export const insertTechnician = async (technicianData) => {
  const query = `
    INSERT INTO technicien (technicien_name, technicien_number, technicien_gmail, worktime, expertise, hire_date, technicien_status)
    VALUES ($1, $2, $3, $4, $5, NOW(), $6)
    RETURNING id_technicien
  `;
  const values = [
    technicianData.technicien_name,
    technicianData.technicien_number,
    technicianData.technicien_gmail,
    technicianData.worktime,
    technicianData.expertise,
    technicianData.technicien_status
  ];
  const result = await pool.query(query, values);
  return result.rows[0].id_technicien;
};

// Link Technician to Workshop (Employs table)
export const linkTechnicianToWorkshop = async (workshopId, technicianId) => {
  const query = `
    INSERT INTO employs (id_workshop, id_technicien)
    VALUES ($1, $2)
  `;
  await pool.query(query, [workshopId, technicianId]);
};



export const getTechniciansByWorkshop = async (workshopId) => {
  const query = `
    SELECT 
      t.id_technicien, 
      t.technicien_name, 
      t.technicien_number, 
      t.expertise, 
      t.worktime, 
      t.technicien_gmail, 
      t.technicien_status, 
      t.hire_date, 
      COUNT(r.id_repair) AS repair_count
    FROM 
      technicien t
    JOIN 
      employs e ON t.id_technicien = e.id_technicien
    LEFT JOIN 
      repair r ON t.id_technicien = r.id_technicien
    WHERE 
      e.id_workshop = $1
    GROUP BY 
      t.id_technicien, t.technicien_name, t.technicien_number, t.expertise, 
      t.worktime, t.technicien_gmail, t.technicien_status, t.hire_date
    ORDER BY 
      repair_count ASC;
  `;
  const result = await pool.query(query, [workshopId]);
  return result.rows;
};
export const deletedTechnician = async (id_technicien) => {
 
    const query = `DELETE FROM technicien WHERE id_technicien = $1 RETURNING *`;
    const values = [id_technicien];
  
    try {
      const result = await pool.query(query, values);
      return result.rowCount > 0 ? result.rows[0] : null;
    } catch (error) {
      throw new Error("Error deleting repair: " + error.message);
    }
  };
  
  export const updateTechnician = async (id_technicien, technicianData) => {
    const query = `
      UPDATE technicien
      SET 
        technicien_name   = $1,
        technicien_number = $2,
        technicien_gmail  = $3,
        worktime          = $4,
        expertise         = $5,
        technicien_status = $6
      WHERE id_technicien = $7
      RETURNING *;
    `;
    const values = [
      technicianData.technicien_name,
      technicianData.technicien_number,
      technicianData.technicien_gmail,
      technicianData.worktime,
      technicianData.expertise,
      technicianData.technicien_status,
      parseInt(id_technicien, 10)
    ];
  
    try {
      const result = await pool.query(query, values);
      return result.rows[0] || null;
    } catch (err) {
      console.error('Error updating technician:', err.stack);
      throw new Error('Database update failed');
    }
  };
  
export const getTechnicianByID = async (workshopId, technicianId) => {
  const query = `
    SELECT 
      t.technicien_name, 
      t.technicien_number, 
      t.expertise, 
      t.worktime, 
      t.technicien_gmail, 
      t.technicien_status, 
      t.hire_date, 
      COUNT(r.id_repair) AS repair_count
    FROM technicien t
    JOIN employs e 
      ON t.id_technicien = e.id_technicien
    LEFT JOIN repair r 
      ON t.id_technicien = r.id_technicien
    WHERE 
      e.id_workshop      = $1
      AND t.id_technicien = $2
    GROUP BY 
      t.id_technicien, t.technicien_name, t.technicien_number, 
      t.expertise, t.worktime, t.technicien_gmail, 
      t.technicien_status, t.hire_date
    ORDER BY 
      repair_count ASC;
  `;
  const result = await pool.query(query, [workshopId, technicianId]);
  return result.rows[0] || null;
};