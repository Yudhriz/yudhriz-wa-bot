const express = require("express");
const SessionController = require("../Controllers/API/SessionController");

const apiRouters = express.Router();

apiRouters.get("/sessions", SessionController.list);
apiRouters.get("/sessions/:sessionId", SessionController.find);
apiRouters.get("/sessions/:sessionId/status", SessionController.status);
apiRouters.post("/sessions/add", SessionController.add);
apiRouters.get("/sessions/:sessionId/add-sse", SessionController.addSSE);
apiRouters.delete("/sessions/:sessionId", SessionController.del);

module.exports = apiRouters;
