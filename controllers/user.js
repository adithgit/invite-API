const userServices = require('../services/user');


exports.login = async (req, res) => {
    try {
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
        const result = await userServices.signup(req.body);
        res.status(200).send({ message: 'signed up', data: result });
    } catch (e) {
        res.status(401).send({ message: e.toString() });
    }
}

exports.logout = async (req, res) => {
    try {
        req.session.destroy();
        res.status(200).send({ message: 'logged out.' });
    } catch (e) {
        res.status(401).send({ message: e.toString() });
    }
}

exports.editUser = async (req, res) => {
    try {
        const result = await userServices.edit(req.body);
        res.status(200).send({ message: 'user details updated.', data: result });
    } catch (e) {
        res.status(401).send({ message: e.toString() });
    }

exports.getInvite = async (req, res) => {
        try {
            const result = await userServices.invite(req.body);
            res.status(200).send({ message: 'invite get successfull', data: result });
        } catch (e) {
            res.status(401).send({ message: e.toString() });
        }
    }
}