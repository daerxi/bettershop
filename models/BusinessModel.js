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
        category: type.STRING,
        website: type.STRING,
        description: type.STRING,
        clicktrack: {
            type: type.INTEGER,
            defaultValue: 0
        },
        userId: {
            type: type.INTEGER,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        country: type.STRING,
        province: type.STRING,
        city: type.STRING,
        address: type.STRING
    });
}
