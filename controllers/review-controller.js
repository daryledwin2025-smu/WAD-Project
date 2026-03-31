const Review = require("../models/Review");
const UserModel = require("../models/user-model");

// GET /browse/reviews/all?shelterId=xxx
exports.showAllReviews = async (req, res) => {
    try {
        const shelterId = req.query.shelterId;
        const shelter = await UserModel.getUserById(shelterId); // retrieve shelter data based on shelter ID
        const reviews = await Review.find({ shelter: shelterId }) // find reviews for specific shelterID, returns a list
            .populate("reviewer", "username") //  for reviewer column, add username (as string) from User model
            // reviewer: { _id: new ObjectId('69c397231ea15a74f63b697a'), username: 'tom' },
            .sort({ createdAt: -1 });
        console.log(reviews);
        const validReviews = reviews.filter(review => review.reviewer !== null); // keep element if condition is true
        // filter out any reviews whose userID may be deleted 

        res.render("reviews", { shelter, reviews: validReviews, shelterId, user: req.session.user, check_error: [], submittedRating: null, submittedComment: ''});
    } catch (error) {
        console.log(error);
    }
};

// POST /browse/reviews
exports.submitReview = async (req, res) => {
    try {
        const shelterId = req.body.shelterId; // passed from ejs as hidden
        const shelter = await UserModel.getUserById(shelterId); // retrieve shelter data based on shelter ID
        const reviews = await Review.find({ shelter: shelterId })
            .populate("reviewer", "username")
            .sort({ createdAt: -1 });
        const validReviews = reviews.filter(review => review.reviewer !== null);

        const rating = req.body.rating; 
        const comment = req.body.comment; 
        const check_error = []; 

        // server side validation
        if (rating === 'null') {
            check_error.push("Please select a rating.");
        }
        if (!comment || comment.trim() === "") {
            check_error.push("Please fill in your comments.");
        }
        console.log(check_error);
        if (check_error.length > 0) {
            return res.render("reviews", { shelter, shelterId, reviews: validReviews, user: req.session.user, check_error, submittedRating: rating, submittedComment: comment });
        }
        await Review.create({
            shelter: req.body.shelterId,
            reviewer: req.session.user._id,
            rating: req.body.rating,
            comment: req.body.comment
        });
        res.redirect(`/browse?shelterId=${shelterId}`);
    } catch (error) {
        console.log(error);
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
            return res.status(403).send("You are not allowed to do that");
        }
        const updateData = { rating: newRating, comment: newComment };
        if (hasChanged) {
            updateData.updatedAt = new Date(); // add in updated date if hasChanged is true
        }
        await Review.findByIdAndUpdate(req.params.id, updateData);
        
        res.redirect(`/browse?shelterId=${req.body.shelterId}`);
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
            return res.status(403).send("You are not allowed to do that");
        }
        await Review.findByIdAndDelete(req.params.id);
        res.redirect(`/browse?shelterId=${req.body.shelterId}`);
    } catch (error) {
        console.log(error);
    }
};