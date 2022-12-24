const userServices = require('../services/user');
const voucher = require('voucher-code-generator');
const { response } = require('express');

exports.login = async (req, res) => {
    try {
        // Verify email and password
        const result = await userServices.login(req.body);
        const {password, ...response} = result._doc;
        // Create session
        req.session.user = {
            id: result._id,
            email: result.email,
        }
        res.status(200).send({ message: 'logged in', data: response });
    } catch (e) {
        res.status(401).send({ message: e.toString() });
    }
}

exports.signup = async (req, res) => {
    try {
        // Signup using email and password 
        const result = await userServices.signup(req.body);
        const {password, ...response} = result._doc;
        res.status(200).send({ message: 'signed up', data: response });
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
        // Update session email to current email if updated
        req.session.user.email = result.email;
        const {password, ...response} = result._doc;
        res.status(200).send({ message: 'user details updated.', data: response });
    } catch (e) {
        res.status(500).send({ message: e.toString() });
    }
}

exports.getInvite = async (req, res) => {
    try {
        // Get invite code 
        const result = await userServices.invite(req.session.user.email);
        res.status(200).send({ message: 'invite get successfull', data: result });
    } catch (e) {
        res.status(500).send({ message: e.toString() });
    }
}