const mongoose = require('../DbInit');
const { Schema, model } = mongoose;

const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        min: 4,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String, // Store the filename of the profile picture
    },
});

let User = model('User', userSchema);
module.exports = User;
