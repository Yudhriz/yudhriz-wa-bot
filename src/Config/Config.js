require("dotenv").config(); // Load variabel dari file .env

const { ALLOWED_NUMBERS, BROWSER_NAME, PORT } = process.env;

const config = {
  allowedNumbers: ALLOWED_NUMBERS ? ALLOWED_NUMBERS.split(",") : null,
  browserName: BROWSER_NAME || "Yudhriz App",
  port: PORT || 3000,
};

module.exports = config;
