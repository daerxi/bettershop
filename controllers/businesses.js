const {Business, BusinessToken} = require("../sync");

const createBusiness = async (name, userId) => {
    return await Business.create({
        name,
        userId
    });
}

const updateBusiness = async (body, userId) => {
    return await Business.update(body, {
        where: {
            userId
        }
    });
}

const getBusiness = async (userId) => {
    return Business.findOne({
        where: {
            userId
        }
    });
}

module.exports = {
    createBusiness,
    getBusiness,
    updateBusiness
}