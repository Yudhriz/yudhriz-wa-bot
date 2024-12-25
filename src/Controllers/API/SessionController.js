const {
  listSessions,
  addSession,
  findSessionById,
  deleteSession,
  sessionExists,
} = require("../../Services/API/SessionService");
const logger = require("../../Utils/logger");
const path = require("path");
const fs = require("fs");

// Mengembalikan daftar semua sesi
const list = async (req, res) => {
  try {
    const sessions = await listSessions();
    res.status(200).json(sessions);
  } catch (error) {
    console.error("❌ Error saat mengambil daftar sesi:", error.message);
    res.status(500).json({ error: "Gagal mengambil daftar sesi." });
  }
};

// Menemukan sesi berdasarkan ID
const find = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const session = await findSessionById(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    res.status(200).json({ message: "Session found", session });
  } catch (error) {
    console.error("❌ Error finding session:", error.message);
    res.status(500).json({ error: "Failed to find session" });
  }
};

// Mengambil status sesi
const status = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const session = await findSessionById(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    res.status(200).json({ status: session.status });
  } catch (error) {
    console.error("❌ Error getting session status:", error.message);
    res.status(500).json({ error: "Failed to get session status" });
  }
};

// Menambahkan sesi baru
const add = async (req, res) => {
  const { sessionId } = req.body;

  try {
    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required." });
    }

    await addSession(sessionId);
    res
      .status(201)
      .json({ message: `Session '${sessionId}' added successfully.` });
  } catch (error) {
    res.status(500).json({ error: "Failed to add session." });
  }
};

// Menambahkan sesi dengan SSE (Server-Sent Events)
const addSSE = async (req, res) => {
  const { sessionId } = req.params;

  // Atur header untuk SSE
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  let qrData = null;

  try {
    // Simpan QR Code dalam variabel lokal
    const botHandler = async (update) => {
      const { qr } = update;
      if (qr) {
        qrData = `data:image/png;base64,${Buffer.from(qr).toString("base64")}`;
        res.write(
          `data: ${JSON.stringify({
            qr: qrData,
            message: "QR Code generated.",
          })}\n\n`
        );
        logger.info({
          action: "generate_qr",
          sessionId,
          message: "QR Code sent to client.",
        });
      }
    };

    // Tambahkan session dengan QR Code
    await addSession(sessionId);
    // Simpan status QR Code dan koneksi
    res.write(
      `data: ${JSON.stringify({ message: "Session added successfully." })}\n\n`
    );
  } catch (error) {
    logger.error({
      action: "add_session_sse_error",
      sessionId,
      error: error.message,
    });
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
  } finally {
    res.end(); // Tutup SSE setelah selesai
  }
};

// Menghapus sesi
const del = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const result = await deleteSession(sessionId);
    if (!result) {
      return res.status(404).json({ error: "Session not found" });
    }
    res.status(200).json({ message: "Session deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting session:", error.message);
    res.status(500).json({ error: "Failed to delete session" });
  }
};

module.exports = { list, find, status, add, addSSE, del };
