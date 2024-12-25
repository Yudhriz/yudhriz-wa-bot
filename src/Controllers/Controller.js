class Controller {
  static async introduction(sock, message) {
    const sender = message.key.remoteJid;
    const reply = "Halo! Selamat datang di WhatsApp Bot saya.";

    // Menggunakan reply untuk membalas pesan yang diterima
    await sock.sendMessage(sender, { text: reply }, { quoted: message });
  }

  static async menu(sock, message) {
    const sender = message.key.remoteJid;
    const menuText =
      "Menu kami:\n1. Nasi Goreng - Rp15.000\n2. Mie Goreng - Rp12.000\n3. Es Teh - Rp5.000";
    await sock.sendMessage(sender, { text: menuText });
  }

  static async price(sock, message) {
    const sender = message.key.remoteJid;
    await sock.sendMessage(sender, {
      text: "Harga nasi goreng adalah Rp15.000.",
    });
  }
}

module.exports = Controller;
