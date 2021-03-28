const Sequelize = require('sequelize');
const UserModel = require('./models/UserModel');
const UserTokenModel = require('./models/UserTokenModel');
const BusinessModel = require('./models/BusinessModel');
const BusinessTokenModel = require('./models/BusinessTokenModel');
const ReviewModel = require('./models/ReviewModel');
const ReplyModel = require('./models/ReplyModel');
const WishListModel = require('./models/WishListModel');
const mysql = require('mysql2/promise');

const dotenv = require('dotenv');
const {config} = require("./common/config");
dotenv.config();

const {host, user, password, database, dialect, pool, port} = config;
initialConnection().then(() => console.log("Initializing..."));

async function initialConnection() {
    const connection = await mysql.createConnection({host, port, user, password});
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
}

const db = new Sequelize(database, user, password, {
    host: host,
    dialect: dialect,
    pool: pool
});

const User = UserModel(db, Sequelize);
const UserToken = UserTokenModel(db, Sequelize);
const Business = BusinessModel(db, Sequelize);
const BusinessToken = BusinessTokenModel(db, Sequelize);
const Review = ReviewModel(db, Sequelize);
const Reply = ReplyModel(db, Sequelize);
const WishList = WishListModel(db, Sequelize);

db.sync().then(() => {
    console.log('Synced Database successfully!');
});

module.exports = {
    User,
    UserToken,
    Business,
    BusinessToken,
    Review,
    Reply,
    WishList
};

