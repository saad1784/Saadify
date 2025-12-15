// backend/api/index.js
const serverless = require("serverless-http");
const app = require("../app.js").default;

module.exports = serverless(app);
