const Review = require("../models/Review");
const UserModel = require("../models/user-model");

// GET /browse/reviews/all?shelterId=xxx
exports.showAllReviews = async (req, res) => {
    try {
        const shelterId = req.query.shelterId;
        const shelter = await UserModel.getUserById(shelterId); // retrieve shelter data based on shelter ID
        const reviews = await Review.find({ shelter: shelterId }) // find reviews for specific shelterID, returns a list
            .populate("reviewer", "username")
            .sort({ createdAt: -1 });
        res.render("reviews", { shelter, reviews, shelterId, user: req.session.user });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
};

// POST /browse/reviews
exports.submitReview = async (req, res) => {
    try {
        await Review.create({
            shelter: req.body.shelterId,
            reviewer: req.session.user._id,
            rating: req.body.rating,
            comment: req.body.comment
        });
        res.redirect(`/browse?shelterId=${req.body.shelterId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
};

// GET /browse/reviews/:id/edit
exports.showEditReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id).populate("shelter");
        // Block if not the reviewer
        if (review.reviewer.toString() !== req.session.user._id.toString()) {
            return res.status(403).send("You are not allowed to do that");
        }
        res.render("editReview", { review, shelterId: review.shelter._id, user: req.session.user });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
};

// POST /browse/reviews/:id/edit
exports.submitEditReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        // Block if not the reviewer
        if (review.reviewer.toString() !== req.session.user._id.toString()) {
            return res.status(403).send("You are not allowed to do that");
        }
        await Review.findByIdAndUpdate(req.params.id, {
            rating: req.body.rating,
            comment: req.body.comment
        });
        res.redirect(`/browse?shelterId=${req.body.shelterId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
};

// POST /browse/reviews/:id/delete
exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        // Block if not the reviewer
        if (review.reviewer.toString() !== req.session.user._id.toString()) {
            return res.status(403).send("You are not allowed to do that");
        }
        await Review.findByIdAndDelete(req.params.id);
        res.redirect(`/browse?shelterId=${req.body.shelterId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
};