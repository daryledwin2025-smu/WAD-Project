const mongoose = require("mongoose");

const favouriteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    petId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pet",
        required: true
    },
    note: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

favouriteSchema.index({ userId: 1, petId: 1 }, { unique: true });

const Favourite = mongoose.model("Favourite", favouriteSchema, "favourites");

exports.addFavourite = (userId, petId) => {
    return Favourite.create({ userId, petId });
};

exports.getFavouritesByUserId = (userId) => {
    return Favourite.find({ userId }).populate("petId").sort({ createdAt: -1 });
};

exports.getFavouriteById = (favouriteId) => {
    return Favourite.findById(favouriteId).populate("petId");
};

exports.updateNote = (favouriteId, note) => {
    return Favourite.findByIdAndUpdate(favouriteId, { note, updatedAt: Date.now() });
};

exports.removeFavourite = (favouriteId) => {
    return Favourite.findByIdAndDelete(favouriteId);
};

exports.checkFavourite = (userId, petId) => {
    return Favourite.findOne({ userId, petId });
};

exports.removeAllByUserId = (userId) => {
    return Favourite.deleteMany({ userId });
};
