const { application } = require("express");
const Review = require("../models/Review");
const Application = require("../models/Application");
const UserModel = require("../models/user-model");
const mongoose = require("mongoose");

// GET /browse/reviews/all?shelterId=xxx
exports.showAllReviews = async (req, res) => {
    try {
        const shelterId = req.query.shelterId;
        const filterRating = req.query.filterRating || '';
        const sortOrder = req.query.sortOrder || 'desc';

        const shelter = await UserModel.getUserById(shelterId);

        const query = { shelter: shelterId };
        if (filterRating) {
            query.rating = parseInt(filterRating);
        }
        let sortQuery;
        if (sortOrder === 'asc') sortQuery = { createdAt: 1 }; // sort by oldest to latest
        else if (sortOrder === 'ratingDesc') sortQuery = { rating: -1 }; // sort by high to low
        else if (sortOrder === 'ratingAsc') sortQuery = { rating: 1 }; // sort by low to high
        else sortQuery = { createdAt: -1 }; // default (latest to oldest) desc by default

        const reviews = await Review.find(query) // find by shelterId and filterRating if there is 
            .populate("reviewer", "username") // .populate fetches reviewer document but only returns specified fields, which is username
            // reviewer: { _id: new ObjectId('69c4db65615b4d548e5c643c'), username: 'darryl'},
            .populate("applicationId", "petName")
            .sort(sortQuery);

        const validReviews = reviews.filter(review => review.reviewer !== null);

        res.render("reviews", { shelter, reviews: validReviews, shelterId, user: req.session.user, filterRating, sortOrder });
    } catch (error) {
        console.log(error);
    }
};

// GET /browse/reviews/new
exports.showNewReviewForm = async (req, res) => {
    try {
        const applicationId = req.query.applicationId; // pass applicationId
        // if no applicationId or appId invalid 
        if (!applicationId || !mongoose.isValidObjectId(applicationId)) {
            return res.redirect("/home");
        }

        // if application not found or user is not the intended user
        const application = await Application.findById(applicationId);
        if (!application || req.session.user._id.toString() !== application.applicant.toString()) {
            return res.redirect("/home");
        }
        

        res.render("new-review", { shelterId: application.shelterId, shelterName: application.shelterName, applicationId, user: req.session.user, check_error: [], submittedRating: null, submittedComment: '' });
    } catch (error) {
        console.log(error);
    }
    
};

// POST /browse/reviews/new
exports.submitNewReview = async (req, res) => {
    try {
        const applicationId = req.body.applicationId; // pass applicationId

        // if no applicationId or appId invalid 
        if (!applicationId || !mongoose.isValidObjectId(applicationId)) {
            return res.redirect("/home");
        }

        // Fetch application to get shelterId, shelterName, petName, check if intended user
        const application = await Application.findById(applicationId);
        if (!application || req.session.user._id.toString() !== application.applicant.toString()) {
            return res.redirect("/home");
        }

        const rating = req.body.rating;
        const comment = req.body.comment;
        const check_error = [];

        // SERVER SIDE VALIDATION TO CHECK ALL REVIEWS ARE VALID
        if (rating === 'null') {
            check_error.push("Please select a rating.");
        }
        if (!comment || comment.trim() === "") { 
            check_error.push("Please fill in your comments.");
        }
        if (check_error.length > 0) {
            return res.render("new-review", { shelterId: application.shelterId, shelterName: application.shelterName, applicationId, user: req.session.user, check_error, submittedRating: rating, submittedComment: comment });
        }

        await Review.create({
            shelter: application.shelterId,
            reviewer: req.session.user._id,
            rating,
            comment, 
            applicationId: req.body.applicationId,
            petName: application.petName // store petName
            // Review.create called without passing createdAt, default value is filled, Date.now gets called at the moment of creation 
        });
        res.redirect("/applications/mine");
    } catch (error) {
        console.log(error); 
    }
};

// GET /browse/reviews/:id/edit
exports.showEditReview = async (req, res) => {
    try {
        // if reviewId is not properly formatted
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.redirect("/home");
        }
        const review = await Review.findById(req.params.id).populate("shelter"); 
        // .populate fetches the entire shelter document from DB

        // if reviewId doesn't exist
        if (!review) {
            return res.redirect("/home");
        }

        // Redirect to home if not the reviewer
        if (review.reviewer.toString() !== req.session.user._id.toString()) {
            return res.redirect(`/home`);
        }
        res.render("editReview", { review, shelterId: review.shelter._id, user: req.session.user }); // shelterId is passed to ejs
    } catch (error) {
        console.log(error);
    }
};

// POST /browse/reviews/:id/edit
exports.submitEditReview = async (req, res) => {
    try {
        // if reviewId is not properly formatted
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.redirect("/home");
        }
        // req.params.id refer to the :id in /browse/reviews/:id/edit
        const review = await Review.findById(req.params.id); // built in method to find review ID 
        const newRating = req.body.rating;
        const newComment = req.body.comment;

        const hasChanged = review.rating !== parseInt(newRating) || review.comment !== newComment;
        // hasChanged is a boolean, if either one of new rating or new comment is not equal to old rating or comment, becomes true

        // if reviewId doesn't exist
        if (!review) {
            return res.redirect("/home");
        }

        // Redirect to home if not the reviewer (only as safety net as the person saving changes can only be the reviewer)
        if (review.reviewer.toString() !== req.session.user._id.toString()) {
            return res.redirect(`/home`);
        }
        const updateData = { rating: newRating, comment: newComment };
        if (hasChanged) {
            updateData.updatedAt = new Date(); // add in updated date if hasChanged is true
        }
        await Review.findByIdAndUpdate(req.params.id, updateData);
        
        res.redirect(`/applications/mine`);
    } catch (error) {
        console.log(error);
    }
};

// POST /browse/reviews/:id/delete
exports.deleteReview = async (req, res) => {
    try {
        // if reviewId is not properly formatted
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.redirect("/home");
        }
        const review = await Review.findById(req.params.id);

        // if reviewId doesn't exist
        if (!review) {
            return res.redirect("/home");
        }
        // Redirect to home if not the reviewer (only as safety net as the person deleting can only be the reviewer)
        if (review.reviewer.toString() !== req.session.user._id.toString()) {
            return res.redirect(`/home`);
        }
        await Review.findByIdAndDelete(req.params.id);
        res.redirect(`/applications/mine`);
    } catch (error) {
        console.log(error);
    }
};