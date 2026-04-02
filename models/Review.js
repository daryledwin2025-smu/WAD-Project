const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    shelter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // points to the _id field in User collection
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // points to the _id field in User collection
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: null },
    applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },
    petName: { type: String }
});

const Review = mongoose.model("Review", reviewSchema, "reviews");

module.exports = Review;