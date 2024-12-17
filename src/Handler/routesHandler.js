const Controller = require("../Controllers/Controller");

class RouterHandler {
  /**
   * Menangani pesan yang dikirim sesuai keyword.
   * @param {object} sock - Socket Baileys.
   * @param {object} message - Pesan yang masuk.
   * @param {Array} routes - Daftar routes (keyword dan handler).
   */
  async handle(sock, message, routes) {
    const sender = message.key.remoteJid;
    const text =
      message.message.conversation ||
      message.message.extendedTextMessage?.text ||
      "";
    const lowerText = text.toLowerCase();

    // Loop semua route dan cari keyword yang cocok
    for (const route of routes) {
      if (route.keyword === "*" || lowerText.includes(route.keyword)) {
        if (typeof route.handler === "function") {
          // Jika handler berupa callback function
          const reply = route.handler();
          await sock.sendMessage(sender, { text: reply });
        } else if (Array.isArray(route.handler)) {
          // Jika handler menggunakan controller
          const [controller, method] = route.handler;
          const handlerFunction = controller[method];
          if (handlerFunction) {
            await handlerFunction(sock, message);
          }
        }
        return; // Keluar setelah menemukan keyword cocok
      }
    }

    // // Jika tidak ada keyword yang cocok
    // await sock.sendMessage(sender, {
    //   text: "Maaf, saya tidak mengerti pesan Anda.",
    // });
  }
}

module.exports = new RouterHandler();
