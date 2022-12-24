const session = require('express-session');
const User = require('../models/user');
var bcrypt = require("bcryptjs");
const voucher = require("voucher-code-generator");
const Referral = require("../models/referral");

exports.login = (credentials) => {
    return new Promise((resolve, reject) => {
        User.findOne({ email: credentials.email }, (err, result) => {
            if (err || !result) return reject(err || "Email not valid.");
            User.comparePassword(credentials.password, result.password, (err, isCorrect) => {
                if (err || !isCorrect) return reject(err || "Password incorrect");
                resolve("login success. session created.");
            });
        })
    })
}

exports.signup = (credentials) => {
    return new Promise((resolve, reject) => {
        // Check if account with mail already exists
        User.findOne({ email: credentials.email }, (err, result) => {
            if (err || result) return reject("User already exists");
        });

        // Check if referral is valid and delete the referral (to ensure one time use)
        Referral.findOneAndDelete({ code: credentials.referral }, (err, referral) => {
            if (err || !referral) return reject(err || "Invalid invitation code");
            // Create new user
            new User(credentials).save().then((user) => {
                if (!user) return reject("Couldn't save the user");
                // Add created user to invitee's referral list 
                User.findOneAndUpdate({email: referral.email}, {$push: {referralList: user._id}}, (err, result)=>{
                    if(err) return reject(err);
                    resolve("Signed up successfully.");
                })
            }).catch((e) => {
                reject(e);
            })
        })
    })
}


exports.edit = async (email, newData) => {
    // Hash password if included in newData
    if (newData.password) {
        newData.password = await bcrypt.hash(newData.password, 10);
    }
    return new Promise((resolve, reject) => {
        User.findOneAndUpdate({ email }, newData, (err, result) => {
            if (err) return reject(err);
            resolve("user details updated.");
        })
    })
}

exports.invite = (email) => {
    return new Promise((resolve, reject) => {

        // Generate Voucher code 
        let code = voucher.generate({
            length: 5
        })
        // Add voucher to refferals list 
        new Referral({ email, code: code[0] }).save().then((result) => {
            if (!result) return reject("Cannot get code");
            return resolve(result);
        }).catch((err) => {
            return reject(err);
        });
    })
}