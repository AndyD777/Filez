import db from "#db/client";

await db.connect();

await seed();

await db.end();

console.log("🌱 Database seeded.");

async function seed() {
  // Clear existing data
  await db.query("DELETE FROM files");
  await db.query("DELETE FROM folders");

  const folderNames = ["Documents", "Pictures", "Music"];
  for (const folderName of folderNames) {
    const { rows } = await db.query(
      `INSERT INTO folders (name) VALUES ($1) RETURNING id`,
      [folderName]
    );
    const folderId = rows[0].id;

    for (let i = 1; i <= 5; i++) {
      const fileName = `${folderName.toLowerCase()}_file_${i}.txt`;
      const size = Math.floor(Math.random() * 1000) + 100; // random size 100-1099
      await db.query(
        `INSERT INTO files (name, size, folder_id) VALUES ($1, $2, $3)`,
        [fileName, size, folderId]
      );
    }
  }
}
