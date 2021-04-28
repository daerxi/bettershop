const Sequelize = require('sequelize');
const UserModel = require('./models/UserModel');
const UserTokenModel = require('./models/UserTokenModel');
const BusinessModel = require('./models/BusinessModel');
const ReviewModel = require('./models/ReviewModel');
const ReplyModel = require('./models/ReplyModel');
const WishListModel = require('./models/WishListModel');
const CategoryModel = require('./models/CategoryModel');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const fs = require('fs');

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
const Review = ReviewModel(db, Sequelize);
const Reply = ReplyModel(db, Sequelize);
const WishList = WishListModel(db, Sequelize);
const Category = CategoryModel(db, Sequelize);

fs.readFile('assets/category.json', (err, data) => {
    if (err) throw err;
    const categories = JSON.parse(data);
    for (const category of categories) {
        Category.findOne({
            where: {
                type: category
            }
        }).then(function (res) {
            if (!res) Category.create({type: category});
            else console.log("--------- category", category, "already inserted --------- ");
        });
    }
});

db.sync().then(() => {
    console.log('Synced Database successfully!');
});

module.exports = {
    User,
    UserToken,
    Business,
    Review,
    Reply,
    WishList,
    Category
};

