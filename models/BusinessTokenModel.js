module.exports = (sequelize, type) => {
    return sequelize.define('businessTokens', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        businessId: {
            type: type.INTEGER,
            references: {
                model: 'businesses',
                key: 'id'
            }
        },
        token: {
            type: type.STRING,
            allowNull: false
        }
    });
}
