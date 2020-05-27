import User from '../../models/User';
import { response } from 'express';

import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import validator from 'validator';
import ValidationError from '../validationError';

export default {
    Query: {
        singleUser: (root, args) => {
            return new Promise((resolve, reject) => {
                User.findOne(args).exec((error, response) => {
                    error ? reject(error) : resolve(response);
                })
            })
        },

        allUsers: () => {
            return new Promise((resolve, reject) => {
                User.find({}).populate().exec((error, response) => {
                    error ? reject(error) : resolve(response);
                })
            })
        }
    },

    Mutation: {
        addUser: async (root, { email, username, password }) => {

            let errors = [];

            if (validator.isEmail(email)) {
                errors.push({
                    key: "email",
                    message: " not_valid",
                })
            }

            if (validator.isEmpty(username)) {
                errors.push({
                    key: "username",
                    message: " not_found",
                })
            }
            if (validator.isLength(password, { min: 4, max: 10 })) {
                errors.push({
                    key: "username",
                    message: " not_found",
                })
            }

            const newUser = await new User({ email, username, password: await bcrypt.hash(password, 5) });
            if (!newUser) {
                throw new Error(`Cannot create such user: ${email}`);
            }
            let savedUser = null;

            try {
                savedUser = await newUser.save();
            } catch (e) {
                if (e.code === 11000) {
                    throw new ValidationError([{
                        key: "email",
                        message: "email_in_use",
                    }]);
                } throw new Error(`Cannot create user with email: ${email}`);
            }
            return jsonwebtoken.sign({
                _id: newUser._id,
                email: newUser.email,
            },
                process.env.JWT_SECRET,
                { expiresIn: '1d' });
        },

        login: async (root, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error(`Cannot find user with email: ${email}`);
            }

            const valid = await bcrypt.compare(password, user.password);
            if (!valid) {
                throw new Error(`Cannot match password to user`);
            }
            return jsonwebtoken.sign({
                _id: user._id,
                email: user.email,
            },
                process.env.JWT_SECRET,
                { expiresIn: '1d' });
        },



        updateUser: async (root, { _id, email, username, password }) => {
            if (!user) {
                throw new Error(`User not authenticated`);
            }

            const response = await User.findByIdAndUpdate({ _id }, {$set: {
                email,
                username,
                password,
            }},{ new: true }).exec();
            if (!response) {
                throw new Error(`Cannot save user ${_id}`);
            }
            return response;
            },

            deleteUser: (root, { _id }) => {
                return new Promise((resolve, reject) => {
                    User.findByIdAndRemove({ _id }).exec((error, response) => {
                        error ? reject(error) : resolve(response);
                    })
                })
            }
    }
}