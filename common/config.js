const dotenv = require('dotenv');
dotenv.config();

let config;
const env = process.env.NODE_ENV;

development = {
    host: "127.0.0.1",
    user: "root",
    password: "supersecretpassword",
    database: "bettershop",
    dialect: "mysql",
    port: "3306",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

production = {
    host: "localhost",
    user: "root",
    password: "e3wejSls2dasnmQ",
    database: "bettershop",
    dialect: "mysql",
    port: "3306",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

if (env === 'dev') config = development;
else config = production;

module.exports = {
    config
};