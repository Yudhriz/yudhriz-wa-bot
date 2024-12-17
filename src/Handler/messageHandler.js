const router = require("./routes");

async function handleMessage(sock, message) {
  try {
    await router.handle(sock, message); // Delegasikan ke router
  } catch (error) {
    console.error("❌ Error handling message:", error.message);
    await sock.sendMessage(message.key.remoteJid, {
      text: "Terjadi kesalahan, silakan coba lagi nanti.",
    });
  }
}

module.exports = { handleMessage };
