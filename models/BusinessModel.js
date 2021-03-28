module.exports = (sequelize, type) => {
    return sequelize.define('businesses', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: type.STRING,
            allowNull: false
        },
        email: {
            type: type.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: type.STRING,
            allowNull: false
        },
        resetToken: type.STRING,
        phone: type.INTEGER,
        category: type.STRING,
        country: type.STRING,
        province: type.STRING,
        city: type.STRING,
        address: type.STRING,
        website: type.STRING,
        logo: type.STRING,
        description: type.STRING,
        clicktrack: {
            type: type.INTEGER,
            defaultValue: 0
        }
    });
}
