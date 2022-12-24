const session = require('express-session');
const User = require('../models/user');
var bcrypt = require("bcryptjs");
const voucher = require("voucher-code-generator");
const Referral = require("../models/referral");

exports.login = (credentials) => {
    return new Promise((resolve, reject) => {
        User.findOne({ email: credentials.email }, (err, user) => {
            if (err || !user) return reject(err || "Email not valid.");
            User.comparePassword(credentials.password, user.password, (err, isCorrect) => {
                if (err || !isCorrect) return reject(err || "Password incorrect");
                resolve(user);
            });
        })
    })
}

exports.signup = (data) => {
    const {organizations, ...credentials} = data;
    return new Promise((resolve, reject) => {
        // Check if account with mail already exists
        User.findOne({ email: credentials.email }, (err, result) => {
            if (err || result) return reject("User already exists");
        });
        
        // Check if referral is valid and delete the referral (to ensure one time use)
        Referral.findOne({ code: credentials.referral }, async(err, referral) => {
            if (err || !referral) return reject(err || "Invalid invitation code");
            // Create new user
            if(organizations){
                credentials.organizations = await JSON.parse(organizations);
            }
            new User(credentials).save().then((user) => {
                if (!user) return reject("Couldn't save the user");
                // Delete referral after user creation
                Referral.deleteOne({ code:referral.code });
                // Add created user to invitee's referral list 
                User.findOneAndUpdate({email: referral.email}, {$push: {referralList: user._id}}, (err, result)=>{
                    if(err) return reject(err);
                    resolve(user);
                })
            }).catch((e) => {
                reject(e);
            })
        })
    })
}


exports.edit = async (email, data) => {
    const {organizations, ...newData} = data;
    // Hash password if included in newData
    if (newData.password) {
        newData.password = await bcrypt.hash(newData.password, 10);
    }
    return new Promise((resolve, reject) => {
        User.findOneAndUpdate({ email }, newData, async (err, result) => {
            if (err || !result) return reject(err || "Update failed.");
            if(organizations){
                result.organizations = await JSON.parse(organizations);
                result.save();
            }
            console.log(result);
            resolve(result);
        })
    })
}

exports.invite = (email) => {
    return new Promise((resolve, reject) => {

        // Generate referral code 
        let code = voucher.generate({
            length: 5
        })
        // Add referral to refferals list 
        new Referral({ email, code: code[0] }).save().then((result) => {
            if (!result) return reject("Cannot get code");
            return resolve(result);
        }).catch((err) => {
            return reject(err);
        });
    })
}