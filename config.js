const dotenv = require('dotenv').config();

module.exports = {
    VAR_PORT: process.env.ENV_PORT || 3000,
    VAR_HOST: process.env.ENV_HOST || "localhost",
    VAR_USER: process.env.ENV_USER || "root",
    VAR_PASSWORD: process.env.ENV_PASSWORD || "",
    VAR_DATABASE: process.env.ENV_DATABASE || "neurotask",
    VAR_PORT_DB:  process.env.ENV_PORT_DB  || "3360"
}