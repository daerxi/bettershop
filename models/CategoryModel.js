module.exports = (sequelize, type) => {
    return sequelize.define('users', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: type.STRING,
            unique: true,
            allowNull: false
        },
        clicktrack: {
            type: type.INTEGER,
            defaultValue: 0
        }
    });
}
