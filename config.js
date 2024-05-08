const dotenv = require('dotenv').config();

module.exports = {
    VAR_PORT: process.env.ENV_PORT,
    VAR_HOST: process.env.ENV_HOST,
    VAR_USER: process.env.ENV_USER,
    VAR_PASSWORD: process.env.ENV_PASSWORD,
    VAR_DATABASE: process.env.ENV_DATABASE,
    VAR_PORT_DB:  process.env.ENV_PORT_DB
}