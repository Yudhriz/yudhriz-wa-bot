const fs = require("fs");
const path = require("path");
const pino = require("pino");

// Path untuk folder logs dan file log
const logDir = path.join(__dirname, "../..//logs");
const logFile = path.join(logDir, "logs.log");

// Pastikan folder logs ada
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
  console.log(`📁 Folder 'logs' berhasil dibuat di ${logDir}`);
}

// Konfigurasi Pino
const logger = pino({
  level: "info", // Sesuaikan level log
  transport: {
    targets: [
      {
        target: "pino/file", // Simpan log ke file
        options: { destination: logFile },
      },
      {
        target: "pino-pretty", // Format log untuk terminal
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      },
    ],
  },
});

module.exports = logger;
