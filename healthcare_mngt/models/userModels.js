const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true, // Ensure email uniqueness
        lowercase: true, // Normalize email to lowercase
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'] // Email validation regex
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    isAdmin:{
        type:Boolean,
        default:false,
    },
    isDoctor:{
        type:Boolean,
        default:false,
    },
    notification:{
        type:Array,
        default:[]
    },
    seennotification:{
        type:Array,
        default:[],
    },
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;
