module.exports = (sequelize, type) => {
    return sequelize.define('users', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firstName: {
            type: type.STRING,
            allowNull: false
        },
        lastName: {
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
        age: type.INTEGER,
        gender: type.STRING,
        country: type.STRING,
        province: type.STRING,
        city: type.STRING,
        profilePhoto: type.STRING
    });
}
