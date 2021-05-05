const sgMail = require('@sendgrid/mail');

function sendEmail(email, templatedId, dynamic_template_data, res, next) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: email,
        from: 'donotreply@bettershop.au',
        templateId: templatedId,
        dynamic_template_data: dynamic_template_data
    };
    sgMail.send(msg, (error) => {
        if (error) return res.status(400).json(error);
    }).then(
        next()
    ).catch(e => {
        return res.status(400).json({error: e.toString()});
    })
}

const isNullOrEmpty = (obj) => {
    return !obj || !obj.trim();
}

function randomString(length) {
    let result = '';
    const characters = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++)
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    return result;
}

function deleteSensitiveInfo(user) {
    delete user["dataValues"].password;
    delete user["dataValues"].verificationCode;
    return user;
}

function getInsensitiveInfo(user) {
    return {
        id: user.id,
        userName: user.userName,
        avatar: user.avatar,
        isBusiness: user.isBusiness
    }
}

module.exports = {
    sendEmail,
    isNullOrEmpty,
    randomString,
    deleteSensitiveInfo,
    getInsensitiveInfo
}