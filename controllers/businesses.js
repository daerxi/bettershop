const {findUserByUserId} = require("./users");
const {Review} = require("../sync");
const {Business} = require("../sync");

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

const getBusinessById = async (id) => {
    return Business.findOne({
        where: {
            id
        }
    });
}

const getRate = async reviews => {
    let rate = 0;
    for (const review of reviews) {
        rate += review.rate;
    }
    return parseInt(rate / reviews.length);
}

const findReviewsByBusinessId = async businessId => {
    return Review.findAll({
        where: {
            businessId
        },
        order: [
            ['updatedAt', 'DESC']
        ]
    });
}

async function getNewBusinessList(businesses, res) {
    let newBusinessList = []
    for (const business of businesses) {
        await findReviewsByBusinessId(business.id).then(async reviews => {
            await getRate(reviews).then(async rate => {
                business.dataValues.rate = rate;
            })
            await findUserByUserId(business.userId).then(async user => {
                business.dataValues.user = user;
            })
            business.dataValues.reviews = reviews;
            newBusinessList.push(business)
        });
    }
    res.status(200).json(newBusinessList);
}

module.exports = {
    createBusiness,
    getBusiness,
    updateBusiness,
    getBusinessById,
    findReviewsByBusinessId,
    getRate,
    getNewBusinessList
}