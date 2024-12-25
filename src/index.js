const { connectDB } = require("./Databases");
const { startBot, loadSession } = require("./Server/bot");
const app = require("../src/Server/api");
const config = require("../src/Config/Config");

(async () => {
  console.log("🚀 Memulai bot WhatsApp...");
  await connectDB();

  await loadSession("default");
  await startBot();

  app.listen(config.port, () => {
    console.log(`🚀 Server berjalan di http://localhost:${config.port}`);
  });
})();
