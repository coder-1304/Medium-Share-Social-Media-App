const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const res = require('express/lib/response');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        unique: true,
        require: true
    },
    username: {
        type: String,
        unique: true,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    messages: {
        type: Array
    },
    friends: {
        type: Array,
        default: ['admin']
    },
    friendReq:{
        type: Array
    },
    posts:{
        type: Array
    },
    avatar:{
        type: Number,
        default: 0
    },
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }]
})

userSchema.methods.generateAuthToken = async function () {
    try {
        const token = jwt.sign({ _id: this._id.toString()}, "iAmShanneeAhirwarAndThisIsTheSignatureKey")
        this.tokens = this.tokens.concat({token: token});
        await this.save();
        console.log('token is generated: ' + token);
        return token;
    } catch (error) {
        console.log(error);
        console.log('token not generated' + error);
    }
}



userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();  //means now save method will be called
})


const User = new mongoose.model('User', userSchema);
module.exports = User;