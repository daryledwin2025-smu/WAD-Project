const { application } = require("express");
const Review = require("../models/Review");
const UserModel = require("../models/user-model");

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

        res.render("reviews", { shelter, reviews: validReviews, shelterId, user: req.session.user, check_error: [], submittedRating: null, submittedComment: '', filterRating, sortOrder });
    } catch (error) {
        console.log(error);
    }
};

// GET /browse/reviews/new
exports.showNewReviewForm = async (req, res) => {
    try {
        const shelterId = req.query.shelterId;
        const shelterName = req.query.shelterName;
        const applicationId = req.query.applicationId; // pass applicationId 
        
        if (!shelterId || !shelterName || !applicationId) {
            return res.redirect("/home"); // when user has not submitted an application yet and wants to submit review
        }

        res.render("new-review", { shelterId, shelterName, applicationId, user: req.session.user, check_error: [], submittedRating: null, submittedComment: '' });
    } catch (error) {
        console.log(error);
    }
    
};

// POST /browse/reviews/new
exports.submitNewReview = async (req, res) => {
    try {
        const shelterId = req.body.shelterId;
        const shelterName = req.body.shelterName; 
        const applicationId = req.body.applicationId; // pass applicationId 
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
            return res.render("new-review", { shelterId, shelterName, applicationId, user: req.session.user, check_error, submittedRating: rating, submittedComment: comment });
        }

        await Review.create({
            shelter: shelterId,
            reviewer: req.session.user._id,
            rating,
            comment, 
            applicationId: req.body.applicationId
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
        const review = await Review.findById(req.params.id).populate("shelter"); 
        // .populate fetches the entire shelter document from DB

        // Block if not the reviewer
        if (review.reviewer.toString() !== req.session.user._id.toString()) {
            return res.redirect(`/browse/reviews/all?shelterId=${review.shelter._id}`);
        }
        res.render("editReview", { review, shelterId: review.shelter._id, user: req.session.user }); // shelterId is passed to ejs
    } catch (error) {
        console.log(error);
    }
};

// POST /browse/reviews/:id/edit
exports.submitEditReview = async (req, res) => {
    try {
        // req.params.id refer to the :id in /browse/reviews/:id/edit
        const review = await Review.findById(req.params.id); // built in method to find review ID 
        const newRating = req.body.rating;
        const newComment = req.body.comment;

        const hasChanged = review.rating !== parseInt(newRating) || review.comment !== newComment;
        // hasChanged is a boolean, if either one of new rating or new comment is not equal to old rating or comment, becomes true

        // Block if not the reviewer
        if (review.reviewer.toString() !== req.session.user._id.toString()) {
            return res.redirect(`/browse/reviews/all?shelterId=${req.body.shelterId}`); // shelterId is passed from ejs to here
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
        const review = await Review.findById(req.params.id);

        // Block if not the reviewer
        if (review.reviewer.toString() !== req.session.user._id.toString()) {
            return res.redirect(`/browse/reviews/all?shelterId=${req.body.shelterId}`);
        }
        await Review.findByIdAndDelete(req.params.id);
        res.redirect(`/applications/mine`);
    } catch (error) {
        console.log(error);
    }
};