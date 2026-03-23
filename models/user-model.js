const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: {
            type : String,
            required : true,
            unique : true
        },
        pass: {
            type : String,
            required : true,
        },
        // email: {
        //     type : String,
        //     required : true,
        // },
        // Phone: {
        //     type : String,
        //     required : true,
        // },
        // Gender: {
        //     type : String,
        //     required : true,
        // },
        // Address: {
        //     type : String,
        //     required : true,
        // },
        account: {
            type : String,
            required : true,
        }
        // shelterName: {
        //     type : String,
        //     required : false,
        // },
        // shelterAddress: {
        //     type : String,
        //     required : false,
        // },
        // shelterPhone: {
        //     type : String,
        //     required : false,
        // }
    }
)

const User = mongoose.model("User", userSchema, "users");

exports.createUser = (user) => {
    return User.create(user);
}

exports.getUserByUsername = (username) => {
    return User.findOne({username});
}

exports.deleteUserByUsername = async (username) => {
  return await User.findByIdAndDelete(username);
};
