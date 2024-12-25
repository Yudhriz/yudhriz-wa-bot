const sequelize = require("./db");
const { State, Menu, Session } = require("./Models");

const models = {
  State: State.init(sequelize),
  Menu: Menu.init(sequelize),
  Session: Session.init(sequelize),
};

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
