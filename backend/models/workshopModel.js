import pool from '../config/db.js';
export const getWorkshopSettings = async (id_workshop) => {
    const query = `
      SELECT workshop_name,
             workshop_adresse,
             workshop_number,
             repair_specialisation,
             workshop_gmail,
             commune,
             wilaya
      FROM workshop
      WHERE id_workshop = $1
    `;
    const { rows } = await pool.query(query, [id_workshop]);
    return rows[0] || null;
  };
  export const updateWorkshopSettings = async (id_workshop, fields) => {
    const setClauses = [];
    const values = [id_workshop];
    let idx = 2;
  
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined && key !== 'id_workshop') {
        // خريطة الحقل "password" إلى عمود القاعدة "workshop_password"
        const column = key === 'password' ? 'workshop_password' : key;
        setClauses.push(`${column} = $${idx}`);
        values.push(value);
        idx++;
      }
    }
  
    if (setClauses.length === 0) return null;
  
    const query = `
      UPDATE workshop
      SET ${setClauses.join(', ')}
      WHERE id_workshop = $1
      RETURNING workshop_name,
                workshop_adresse,
                workshop_number,
                repair_specialisation,
                workshop_gmail,
                commune,
                wilaya
    `;
    const { rows } = await pool.query(query, values);
    return rows[0] || null;
  };
  
  
  