const bcrypt = require("bcrypt");
const {signToken} = require("./auth");
const {Business, BusinessToken} = require("../sync");

const createBusiness = async (name, email, rawPassword) => {
    const password = bcrypt.hashSync(rawPassword, 10);
    return await Business.create({
        name,
        email,
        password
    });
}

const login = async (email, rawPassword, res) => {
    await findBusinessByEmail(email).then(async business => {
        if (business) {
            business = business.dataValues;
            if (bcrypt.compareSync(rawPassword, business.password)) {
                const token = signToken(business.id);
                await findTokenByBusinessId(business.id).then(async businessToken => {
                    if (businessToken) await destroyToken(business.id);
                    const loginInfo = await createToken(business.id, token);
                    res.status(201).json(loginInfo);
                });
            } else res.status(401).json({error: "invalid password"});
        } else res.status(404).json({error: "user_not_found"});
    });
}

const findTokenByBusinessId = async (businessId) => {
    return BusinessToken.findOne({
        where: {
            businessId
        }
    });
}

const findBusinessByEmail = async (email) => {
    return Business.findOne({
        where: {
            email
        }
    });
}

const destroyToken = async (businessId) => {
    return await BusinessToken.destroy({
        where: {
            businessId
        }
    });
}

const createToken = async (businessId, token) => {
    return await BusinessToken.create({
        businessId,
        token
    });
}

module.exports = {
    createBusiness,
    login
}