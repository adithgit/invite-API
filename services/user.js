const session = require('express-session');
const User = require('../models/user');

exports.login = (credentials) => {
    return new Promise((resolve, reject) => {
        User.findOne({ email: credentials.email },(err, result) => {
            if (err || !result) return reject(err || "Email not valid.");
            User.comparePassword(credentials.password, result.password, (err, isCorrect) => {
                console.log(err);
                if (err || !isCorrect) return reject(err || "Password incorrect");
                resolve(result);
            });
        })
    })
}

exports.signup = (credentials) => {
    return new Promise((resolve, reject) => {
        User.findOne({ email: credentials.email }, (err, result) => {
            if (err || result) return reject("User already exists");
        })
        new User(credentials).save().then((result) => {
            if (!result) return reject("Couldn't save the user");
            resolve(result);
        }).catch((e) => {
            reject(e);
        })
    })
}


exports.edit = (credentials) => {
    return new Promise((resolve, reject) => {

    })
}

exports.invite = (credentials) => {
    return new Promise((resolve, reject) => {

    })
}