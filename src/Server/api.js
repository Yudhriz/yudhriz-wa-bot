const express = require("express");
const apiRouters = require("../Routes/apiRouters");
const logRequests = require("../Middleware/LogMiddleware");

const app = express();

// Middleware
app.use(express.json());

// Logging setiap request
app.use(logRequests);

// Gunakan router
app.use("/", apiRouters);

module.exports = app;
