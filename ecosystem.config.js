module.exports = {
  apps: [
    {
      name: "whatsapp-bot",
      script: "./src/index.js",
      watch: true,
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
