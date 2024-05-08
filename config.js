const dotenv = require('dotenv').config();

module.exports = {
    PORT: process.env.PORT,
    VAR_HOST: process.env.VAR_HOST,
    VAR_USER: process.env.VAR_USER,
    VAR_PASSWORD: process.env.VAR_PASSWORD,
    VAR_DATABASE: process.env.VAR_DATABASE,
    VAR_PORT_DB:  process.env.VAR_PORT_DB
}