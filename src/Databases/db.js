const { Sequelize } = require("sequelize");
const path = require("path");
const fs = require("fs");

// Pastikan folder database ada
const dbFolder = path.join(__dirname, "../Databases");
if (!fs.existsSync(dbFolder)) {
  fs.mkdirSync(dbFolder, { recursive: true });
  console.log("📁 Folder 'Databases' berhasil dibuat.");
}

// Path file database SQLite
const dbPath = path.join(dbFolder, "data-bot.sqlite");

// Koneksi Sequelize
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: dbPath, // Path file database
  logging: false, // Nonaktifkan logging SQL
});

module.exports = sequelize;
