const bcrypt = require("bcrypt");
const {signToken} = require("./auth");
const {User, UserToken} = require("../sync");

const createUser = async (firstName, lastName, email, rawPassword, isBusiness) => {
    const password = bcrypt.hashSync(rawPassword, 10);
    return await User.create({
        firstName,
        lastName,
        email,
        password,
        isBusiness
    });
}

const login = async (email, rawPassword, res) => {
    await findUserByEmail(email).then(async user => {
        if (user) {
            user = user.dataValues;
            console.log(rawPassword, user);
            if (bcrypt.compareSync(rawPassword, user.password)) {
                const token = signToken(user.id);
                await findTokenByUserId(user.id).then(async userToken => {
                    if (userToken) await destroyToken(user.id);
                    const loginInfo = await createToken(user.id, token);
                    res.status(201).json(loginInfo);
                });
            } else res.status(401).json({error: "Your password is not correct."});
        } else res.status(404).json({error: "Account does not exist."});
    });
}

const findTokenByUserId = async (userId) => {
    return UserToken.findOne({
        where: {
            userId
        }
    });
}

const findUserByEmail = async (email) => {
    return User.findOne({
        where: {
            email
        }
    });
}

const destroyToken = async (userId) => {
    return await UserToken.destroy({
        where: {
            userId
        }
    });
}

const createToken = async (userId, token) => {
    return await UserToken.create({
        userId,
        token
    });
}

module.exports = {
    login,
    createUser
}