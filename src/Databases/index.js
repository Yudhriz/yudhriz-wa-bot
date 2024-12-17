const sequelize = require("./db");
const models = require("./Models");

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Koneksi database berhasil.");

    // Sinkronisasi semua model
    await sequelize.sync({ alter: true });
    console.log("✅ Semua tabel berhasil disinkronkan.");
  } catch (error) {
    console.error("❌ Gagal menghubungkan ke database:", error.message);
  }
};

module.exports = { connectDB, models };
