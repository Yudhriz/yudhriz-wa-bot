require("dotenv").config(); // Load variabel dari file .env

const { ALLOWED_NUMBERS } = process.env;

const config = {
  allowedNumbers: ALLOWED_NUMBERS ? ALLOWED_NUMBERS.split(",") : null,
  browserName: "Yudhriz App",
};

module.exports = config;
