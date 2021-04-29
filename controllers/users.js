const bcrypt = require("bcrypt");
const {sendEmail} = require("../common/utils");
const {randomString} = require("../common/utils");
const {signToken} = require("./auth");
const {User, UserToken} = require("../sync");

const createUser = async (userName, email, rawPassword, isBusiness) => {
    const password = bcrypt.hashSync(rawPassword, 10);
    return await User.create({
        userName,
        email,
        password,
        isBusiness
    });
}

const login = async (email, rawPassword, res) => {
    await findUserByEmail(email).then(async user => {
        if (user) {
            user = user.dataValues;
            if (bcrypt.compareSync(rawPassword, user.password)) {
                return await updateToken(user.id, res);
            } else res.status(401).json({error: "Your password is not correct."});
        } else res.status(404).json({error: "Account does not exist."});
    });
}

const updateToken = async (id, res) => {
    const token = signToken(id);
    await findTokenByUserId(id).then(async userToken => {
        if (userToken) await destroyToken(id);
        const loginInfo = await createToken(id, token);
        res.status(201).json(loginInfo);
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

const findUserByUserId = async (id) => {
    return User.findOne({
        where: {
            id
        }
    });
}

const generateVerificationCode = async (user, res) => {
    const verificationCode = randomString(6)
    sendEmail(user.email, "d-d85183e356dd4bc683aa63698359c76c", {code: verificationCode}, res, () => {
        return User.update({
            verificationCode
        }, {
            where: {
                id: user.id
            }
        });
    });
}

const findUserByVerificationCode = async (verificationCode) => {
    return User.findOne({
        where: {
            verificationCode
        }
    })
}

const updatePassword = async (password) => {
    password = bcrypt.hashSync(password, 10);
    return await User.update({
        password
    }, {
        where: {
            id: localStorage.getItem("user-id")
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
    createUser,
    updateToken,
    destroyToken,
    findUserByUserId,
    findUserByEmail,
    updatePassword,
    generateVerificationCode,
    findUserByVerificationCode
}