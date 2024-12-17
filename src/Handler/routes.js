const Controller = require("../Controllers/Controller");

const routes = [
    // Handler menggunakan callback function
    { keyword: "ping", handler: () => "pong" },
    { keyword: "assalamualaikum", handler: () => "Waalaikumsalam, selamat datang!" },

    // Handler menggunakan controller
    { keyword: "halo", handler: [Controller, "introduction"] },
    { keyword: "menu", handler: [Controller, "menu"] },
    { keyword: "harga", handler: [Controller, "price"] },

    // Balasan default jika tidak ada keyword yang cocok
    // { keyword: "*", handler: [Controller, "default"] },
];

module.exports = routes;
