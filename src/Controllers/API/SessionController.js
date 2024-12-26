const {
  listSessions,
  addSession,
  findSessionById,
  deleteSession,
  sessionExists,
  generateNewQR,
} = require("../../Services/API/SessionService");
const logger = require("../../Utils/logger");

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

    const qrCode = await generateNewQR(sessionId);
    await addSession(sessionId, "pending", qrCode);

    res.status(201).json({
      message: `Session '${sessionId}' added successfully.`,
      qr: qrCode,
    });
  } catch (error) {
    logger.error({
      action: "add_session_error",
      sessionId,
      error: error.message,
    });
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

  try {
    // Gunakan logika yang sama untuk menambahkan sesi dan menghasilkan QR Code
    const qrCode = await generateNewQR(sessionId);

    // Kirim QR Code ke klien
    res.write(
      `data: ${JSON.stringify({
        qr: qrCode,
        message: "QR Code generated.",
      })}\n\n`
    );

    logger.info({
      action: "add_session_sse_success",
      sessionId,
      message: "QR Code sent via SSE.",
    });
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
