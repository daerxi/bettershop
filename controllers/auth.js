const JWT = require("jsonwebtoken");
const {UserToken} = require("../sync");
const moment = require("moment");

function tokenResult(token, res, next) {
    if (!token) res.status(401).json({error: "Not authorized"});
    else {
        if (decodeJWT(token.dataValues.token).exp >= moment().unix()) next();
        else res.status(401).json({error: "Token expired"});
    }
}

const decodeJWT = token => {
    return JWT.decode(token, process.env.JWT_SECRET);
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

const accessToken = (req, res) => {
    const header = req.headers['authorization'];
    if (typeof header !== 'undefined') {
        const bearer = header.split(' ');
        req.header.token = bearer[1];
        if (bearer[0].toLowerCase() === "bearer")
            if (!bearer[1].trim()) res.status(401).json({error: "Empty Token"});
            else return bearer[1].trim();
        else res.status(401).json({error: "Invalid Auth Type"});
    } else res.sendStatus(403);
}

const signToken = (id, time = 30, unit = 'minutes') => {
    return JWT.sign({
        iss: 'BetterShop',
        sub: id,
        iat: moment().unix(),
        exp: moment().add(time, unit).unix()
    }, process.env.JWT_SECRET);
}

module.exports = {
    checkToken,
    signToken,
    decodeJWT
}