const mongoose = require('mongoose');

const viewSchema = new mongoose.Schema({
    petId: {
        type: String,
        required: true
    },
    userId: {
        type: String
    },
    viewedAt: {
        type: Date,
        default: Date.now
    }
});

const View = mongoose.model('View', viewSchema, 'views');

exports.addView = function(newView) {
    return View.create(newView);
};

exports.retrieveAll = function() {
    return View.find();
};

exports.countByPetId = function(petId) {
    return View.countDocuments({ petId: petId });
};