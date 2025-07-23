import db from "./client.js";


// Get all files with folder_name
export async function getAllFiles() {
  const sql = `
    SELECT files.*, folders.name AS folder_name
    FROM files
    JOIN folders ON files.folder_id = folders.id
    ORDER BY files.id
  `;
  const { rows } = await db.query(sql);
  return rows;
}

// Get all folders
export async function getAllFolders() {
  const { rows } = await db.query("SELECT * FROM folders ORDER BY id");
  return rows;
}

// Get folder by id, with files aggregated as JSON array
export async function getFolderById(id) {
  const sql = `
    SELECT 
      folders.*,
      COALESCE(
        json_agg(files ORDER BY files.id) FILTER (WHERE files.id IS NOT NULL), 
        '[]'
      ) AS files
    FROM folders
    LEFT JOIN files ON files.folder_id = folders.id
    WHERE folders.id = $1
    GROUP BY folders.id
  `;
  const { rows } = await db.query(sql, [id]);
  return rows[0];
}

// Create file in a folder
export async function createFileInFolder(folderId, { name, size }) {
  const sql = `
    INSERT INTO files (name, size, folder_id)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const { rows } = await db.query(sql, [name, size, folderId]);
  return rows[0];
}

// Check if folder exists by id
export async function folderExists(id) {
  const { rowCount } = await db.query("SELECT 1 FROM folders WHERE id = $1", [id]);
  return rowCount > 0;
}
