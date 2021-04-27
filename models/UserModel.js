module.exports = (sequelize, type) => {
    return sequelize.define('users', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: type.STRING,
            unique: true,
            allowNull: false
        },
        // 1 as business, 0 as normal user
        isBusiness:  type.BOOLEAN,
        avatar: type.STRING,
        resetToken: type.STRING
    });
}
