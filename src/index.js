const { connectDB } = require("./Databases");
const { startBot } = require("./bot");

(async () => {
  console.log("🚀 Memulai bot WhatsApp...");
  await connectDB();
  await startBot();
})();
