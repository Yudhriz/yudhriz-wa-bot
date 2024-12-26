const Session = require("../../Databases/Models/Session");
const logger = require("../../Utils/logger");
const qrcode = require("qrcode");

// Menambahkan atau memperbarui sesi
const addSession = async (
  sessionId,
  status = "pending",
  qr = null,
  credentials = null
) => {
  try {
    // Cari sesi berdasarkan ID
    const existingSession = await Session.findOne({ where: { sessionId } });

    if (existingSession) {
      // Update hanya kolom yang diberikan
      const updates = { status };
      if (qr !== null) updates.qr = qr;
      if (credentials !== null) updates.credentials = credentials;

      await existingSession.update(updates);
      logger.info({
        action: "update_session",
        sessionId,
        status,
        qr: qr ? "QR diperbarui" : "QR tidak diubah",
        credentials: credentials
          ? "Kredensial diperbarui"
          : "Kredensial tidak diubah",
        message: "Session updated successfully.",
      });
    } else {
      // Jika sesi baru, tambahkan ke database
      await Session.create({ sessionId, status, qr, credentials });
      logger.info({
        action: "add_session",
        sessionId,
        status,
        message: "Session added successfully.",
      });
    }
  } catch (error) {
    logger.error({
      action: "add_or_update_session_error",
      sessionId,
      error: error.message,
    });
    throw error;
  }
};

// Mengambil semua sesi
const listSessions = async () => {
  try {
    const sessions = await Session.findAll();
    logger.info({
      action: "list_sessions",
      count: sessions.length,
      message: "Sessions retrieved successfully.",
    });
    return sessions;
  } catch (error) {
    logger.error({ action: "list_sessions_error", error: error.message });
    return [];
  }
};

// Mengambil sesi berdasarkan ID
const findSessionById = async (sessionId) => {
  try {
    const session = await Session.findOne({ where: { sessionId } });
    if (!session) {
      logger.warn({
        action: "find_session",
        sessionId,
        message: "Session not found.",
      });
      return null;
    }
    logger.info({
      action: "find_session",
      sessionId,
      message: "Session found successfully.",
    });
    return session;
  } catch (error) {
    logger.error({
      action: "find_session_error",
      sessionId,
      error: error.message,
    });
    throw error;
  }
};

// Membuat QR baru untuk sesi
const generateNewQR = async (sessionId) => {
  try {
    // Buat QR Code baru
    const qr = `Session-${sessionId}-${Date.now()}`;
    const qrCode = await qrcode.toDataURL(qr);

    logger.info({
      action: "generate_new_qr",
      sessionId,
      message: "New QR code generated successfully.",
    });

    return qrCode;
  } catch (error) {
    logger.error({
      action: "generate_new_qr_error",
      sessionId,
      error: error.message,
    });
    throw error;
  }
};

// Menghapus sesi berdasarkan ID
const deleteSession = async (sessionId) => {
  try {
    const session = await findSessionById(sessionId);
    if (!session) {
      logger.warn({
        action: "delete_session",
        sessionId,
        message: "Session not found.",
      });
      return false;
    }
    await session.destroy();
    logger.info({
      action: "delete_session",
      sessionId,
      message: "Session deleted successfully.",
    });
    return true;
  } catch (error) {
    logger.error({
      action: "delete_session_error",
      sessionId,
      error: error.message,
    });
    throw error;
  }
};

// Memeriksa apakah sesi ada
const sessionExists = async (sessionId) => {
  try {
    const exists = (await Session.count({ where: { sessionId } })) > 0;
    logger.info({
      action: "check_session_exists",
      sessionId,
      exists,
      message: "Session existence checked.",
    });
    return exists;
  } catch (error) {
    logger.error({
      action: "check_session_exists_error",
      sessionId,
      error: error.message,
    });
    return false;
  }
};

module.exports = {
  addSession,
  listSessions,
  findSessionById,
  generateNewQR,
  deleteSession,
  sessionExists,
};