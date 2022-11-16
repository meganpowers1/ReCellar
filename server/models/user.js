
// for validation
const Joi = require('joi');
const mongoose = require('mongoose');

// This creates a model to validate whether the user credential details have been entered properl
// during registration
const User = mongoose.model('User', new mongoose.Schema({
    // make sure the username, email, and password are present
    // and fit within a certain length, and are certain data types
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    }
}));

// validateUser
// params: user
// This function uses Joi to make a new schema and validate the user based on
// the pased-in user by comparing it to the schema details
function validateUser(user) {
    const schema = Joi.object({
        username: Joi.string() .min(6) .required(),
        email: Joi.string() .min(6) .required().email(),
        password: Joi.string() .min(6) .required()
    });
    console.log(schema.validate(user));
    return schema.validate(user);
}
// Export both for use elsewhere
exports.User = User;
exports.validate = validateUser;
