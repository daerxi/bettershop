const JWT = require("jsonwebtoken");
const {UserToken, BusinessToken} = require("../sync");
const moment = require("moment");

function tokenResult(token, res, next) {
    if (!token) res.status(401).json({error: "Not authorized"});
    else {
        const decodedJWT = JWT.decode(token.dataValues.token, process.env.JWT_SECRET);
        if (decodedJWT.exp >= moment().unix()) next();
        else res.status(401).json({error: "Token expired"});
    }
}

const checkToken = (req, res, next) => {
    const bearerToken = accessToken(req, res);
    UserToken.findOne({
        where: {
            token: bearerToken
        }
    }).then(token => {
        tokenResult(token, res, next);
    });
}

const checkBusinessToken = (req, res, next) => {
    const bearerToken = accessToken(req, res);
    BusinessToken.findOne({
        where: {
            token: bearerToken
        }
    }).then(token => {
        tokenResult(token, res, next);
    });
}

const accessToken = (req, res) => {
    const header = req.headers['authorization'];
    if (typeof header !== 'undefined') {
        const bearer = header.split(' ');
        if (bearer[0].toLowerCase() === "bearer")
            if (!bearer[1].trim()) res.status(401).json({error: "Empty Token"});
            else return bearer[1].trim();
        else res.status(401).json({error: "Invalid Auth Type"});
    } else res.sendStatus(403);
}

const signToken = id => {
    return JWT.sign({
        iss: 'BetterShop',
        sub: id,
        iat: moment().unix(),
        exp: moment().add(1, 'week').unix()
    }, process.env.JWT_SECRET);
}

const universalLogin = (login, req, res) => {
    try {
        const email = req.body.email.toLowerCase().trim();
        const rawPassword = req.body.password.trim();
        login(email, rawPassword, res).then(async userToken => {
            res.status(201).json(userToken);
        });
    } catch (error) {
        if (error.errors) res.status(400).json({error: error.errors[0].message});
        else res.status(400).json({error});
    }
}

const isNullOrEmpty = (obj) => {
    return !obj || !obj.trim()
}

module.exports = {
    checkToken,
    checkBusinessToken,
    signToken,
    universalLogin,
    isNullOrEmpty
}