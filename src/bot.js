const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
} = require("@whiskeysockets/baileys");
const qrcode = require("qrcode-terminal");
const fs = require("fs");
const path = require("path");
const routes = require("./Handler/routes"); // Daftar routes
const routerHandler = require("./Handler/routesHandler"); // Logika router
const config = require("./Config/Config"); // Import konfigurasi

// Path untuk menyimpan sesi
const sessionPath = path.join(__dirname, "../session");

// Pastikan folder session ada
if (!fs.existsSync(sessionPath)) {
  fs.mkdirSync(sessionPath, { recursive: true });
  console.log("📁 Folder 'session' berhasil dibuat.");
}

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    browser: [config.browserName, "Desktop", "1.0"],
  });

  // Event: Koneksi update
  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("🔗 Scan QR Code ini untuk menyambungkan bot:");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "open") {
      console.log("✅ Bot berhasil terhubung ke WhatsApp!");
    } else if (connection === "close") {
      const disconnectReason = lastDisconnect?.error?.output?.statusCode;

      if (disconnectReason === DisconnectReason.loggedOut) {
        console.log(
          "❌ Sesi telah ditutup. Hapus folder 'session' dan scan ulang QR Code untuk menyambungkan ulang."
        );
        process.exit(1); // Keluar dari proses agar tidak restart otomatis
      } else {
        console.log("⚠️ Koneksi terputus. Mencoba menyambung ulang...");
        startBot(); // Restart bot jika koneksi terputus selain loggedOut
      }
    }
  });

  // Simpan state jika ada perubahan
  sock.ev.on("creds.update", saveCreds);

  // Event: Pesan masuk
  sock.ev.on("messages.upsert", async (m) => {
    const message = m.messages[0];
    if (!message.key.fromMe && message.message) {
      await routerHandler.handle(sock, message, routes); // Delegasikan ke routerHandler
    }
  });
}

module.exports = { startBot };
