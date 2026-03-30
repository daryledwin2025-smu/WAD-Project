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

exports.addView = async function(newView) {
    // check if same user already viewed this pet
    let existing = await View.findOne({
        petId: newView.petId,
        userId: newView.userId
    });
    // if not found, create
    if (!existing) {
        return View.create(newView);
    }
    return null;
};
exports.retrieveAll = function() {
    return View.find();
};

exports.countByPetId = function(petId) {
    return View.countDocuments({ petId: petId });
};