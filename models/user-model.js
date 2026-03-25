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
            required : true
        },
        email: {
            type : String,
            required : true
        },
        phone: {
            type : String,
            required : true
        },
        gender: {
            type : String,
            required : true
        },
        account: {
            type : String,
            required : true
        },
        shelterName: {
            type : String
        },
        shelterEmail: {
            type : String
        },
        shelterAddress: {
            type : String
        },
        shelterNumber: {
            type : String
        }
    }
)

const User = mongoose.model("User", userSchema, "users");

exports.createUser = (user) => {
    return User.create(user);
}

exports.getUserByUsername = (username) => {
    return User.findOne({username});
}

// exports.updateUserByUsername = async (username, password) => {
//   return User.updateOne({ username }, {password});
// };

exports.deleteUserByUsername = async (username) => {
  return User.findOneAndDelete({ username });
};

exports.getAllShelters = () => {
  return User.find({ account: "Shelter" });
};