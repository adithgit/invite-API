const session = require('express-session');
const User = require('../models/user');
var bcrypt = require("bcryptjs");

exports.login = (credentials) => {
    return new Promise((resolve, reject) => {
        User.findOne({ email: credentials.email }, (err, result) => {
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


exports.edit = async (email, newData) => {
    if (newData.password) {
        newData.password = await bcrypt.hash(newData.password, 10);
    }
    return new Promise((resolve, reject) => {
        User.findOneAndUpdate({ email }, newData, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })
}

exports.invite = (credentials) => {
    return new Promise((resolve, reject) => {
resolve("sdf");
    })
}