const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
} = require("@whiskeysockets/baileys");
const qrcode = require("qrcode-terminal");
const fs = require("fs");
const path = require("path");
const { addSession, findSessionById } = require("../Services/SessionService"); // Import layanan sesi
const routes = require("../Handler/routes"); // Daftar routes
const routerHandler = require("../Handler/routesHandler"); // Logika router
const config = require("../Config/Config"); // Import konfigurasi
const logger = require("../Utils/logger"); // Import logger

// Path untuk menyimpan sesi
const sessionPath = path.join(__dirname, "../../session");

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
  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("🔗 Scan QR Code ini untuk menyambungkan bot:");
      qrcode.generate(qr, { small: true });
      const qrData = `data:image/png;base64,${Buffer.from(qr).toString(
        "base64"
      )}`;
      await addSession("default", "pending", qrData);
      logger.info({ action: "save_qr", message: "QR Code saved in session." });
    }

    if (connection === "open") {
      console.log("✅ Bot berhasil terhubung ke WhatsApp!");
      logger.info("✅ Bot berhasil terhubung ke WhatsApp!");

      // Simpan sesi ke database setelah terhubung
      await addSession("default", "connected", JSON.stringify(state.creds));
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

  // Event untuk menangani pesan masuk
  sock.ev.on("messages.upsert", async (m) => {
    const message = m.messages[0];

    // Abaikan pesan dari bot sendiri atau pesan tanpa isi
    if (message.key.fromMe || !message.message) return;

    const sender = message.key.remoteJid;
    // Ekstrak konten pesan
    let content = "";
    if (message.message.conversation) {
      content = message.message.conversation; // Pesan teks biasa
    } else if (message.message.extendedTextMessage) {
      content = message.message.extendedTextMessage.text; // Pesan teks dengan reply
    } else if (message.message.imageMessage) {
      content = "[Image]"; // Pesan berupa gambar
    } else if (message.message.videoMessage) {
      content = "[Video]"; // Pesan berupa video
    } else if (message.message.documentMessage) {
      content = "[Document]"; // Pesan berupa dokumen
    } else if (message.message.audioMessage) {
      content = "[Audio]"; // Pesan berupa audio
    } else {
      content = "[Unknown Message Type]"; // Jenis pesan lainnya
    }

    // Log pesan masuk
    logger.info({
      action: "received_message",
      sender,
      content,
    });

    try {
      // Delegasikan ke routerHandler untuk menangani pesan
      const response = await routerHandler.handle(sock, message, routes);

      // Log respons yang dikirim
      logger.info({
        action: "sent_response",
        recipient: sender,
        response,
      });
    } catch (error) {
      logger.error({
        action: "error_handling_message",
        sender,
        error: error.message,
      });
    }
  });

  // Simpan state jika ada perubahan
  sock.ev.on("creds.update", saveCreds);
}

// Fungsi untuk memuat sesi dari database
async function loadSession(sessionId) {
  const session = await findSessionById(sessionId);
  if (session) {
    fs.writeFileSync(
      path.join(sessionPath, "auth_info.json"),
      session.credentials
    );
    console.log(`✅ Sesi "${sessionId}" dimuat dari database.`);
  } else {
    console.log(`❌ Sesi "${sessionId}" tidak ditemukan.`);
  }
}

module.exports = { startBot, loadSession };
