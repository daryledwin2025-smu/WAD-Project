const mongoose = require('mongoose');

const viewSchema = new mongoose.Schema({
    petId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    viewedAt: {
        type: Date,
        default: Date.now
    },
    viewCount: {
        type: Number,
        default: 1
    }
});

const View = mongoose.model('View', viewSchema, 'views');

exports.addView = async function(newView) {
    // check if same user already viewed this pet
    let existing = await View.findOne({
        petId: newView.petId,
        userId: newView.userId
    });

    // if found, update viewCount and viewedAt
    if (existing) {
        return View.updateOne(
            { petId: newView.petId, userId: newView.userId },
            {
                $inc: { viewCount: 1 },
                $set: { viewedAt: Date.now() }
            }
        );
    }

    // if not found, create new view record
    return View.create(newView);
};
exports.retrieveAll = function() {
    return View.find();
};

exports.countByPetId = function(petId) {
    return View.countDocuments({ petId: petId });
};

exports.deleteByPetId = function(petId) {
    return View.deleteMany({ petId: petId });
};
exports.findByPetId = function(petId) {
    return View.find({ petId: petId });
};
exports.findByPetAndUser = function(petId, userId) {
    return View.findOne({ petId: petId, userId: userId });
};