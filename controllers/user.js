const userServices = require('../services/user');
const voucher = require('voucher-code-generator');

exports.login = async (req, res) => {
    try {
        // With email and password in body
        const result = await userServices.login(req.body);
        req.session.user = {
            id: result._id,
            email: result.email,
        }
        res.status(200).send({ message: 'logged in', data: result });
    } catch (e) {
        res.status(401).send({ message: e.toString() });
    }
}

exports.signup = async (req, res) => {
    try {
        // Singnup using email and password 
        const result = await userServices.signup(req.body);
        res.status(200).send({ message: 'signed up', data: result });
    } catch (e) {
        res.status(401).send({ message: e.toString() });
    }
}

exports.logout = async (req, res) => {
    try {
        // Destroy session data 
        req.session.destroy();
        res.status(200).send({ message: 'logged out.' });
    } catch (e) {
        res.status(401).send({ message: e.toString() });
    }
}

exports.editUser = async (req, res) => {
    try {
        // Change their own info only 
        const result = await userServices.edit(req.session.user.email, req.body);
        res.status(200).send({ message: 'user details updated.', data: result });
    } catch (e) {
        res.status(401).send({ message: e.toString() });
    }
}

exports.getInvite = async (req, res) => {
    try {
        const result = await userServices.invite(req.session.user.email);
        res.status(200).send({ message: 'invite get successfull', data: result });
    } catch (e) {
        res.status(401).send({ message: e.toString() });
    }
}