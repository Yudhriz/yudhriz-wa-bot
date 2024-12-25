const Session = require("../../Databases/Models/Session");
const logger = require("../../Utils/logger");

// Menambahkan atau memperbarui sesi
const addSession = async (sessionId, status = "pending", qr = null) => {
  try {
    const existingSession = await Session.findOne({ where: { sessionId } });
    if (existingSession) {
      await existingSession.update({ status, qr });
      logger.info({
        action: "update_session",
        sessionId,
        status,
        message: "Session updated successfully.",
      });
    } else {
      await Session.create({ sessionId, status, qr });
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
    const session = await findSessionById(sessionId);
    const exists = !!session;
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
  deleteSession,
  sessionExists,
};
