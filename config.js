const dotenv = require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 3000,
    VAR_HOST: process.env.VAR_HOST || localhost,
    VAR_USER: process.env.VAR_USER || root,
    VAR_PASSWORD: process.env.VAR_PASSWORD,
    VAR_DATABASE: process.env.VAR_DATABASE || neurotask,
    VAR_PORT_DB:  process.env.VAR_PORT_DB || 3306
}