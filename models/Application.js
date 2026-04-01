const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    applicantName: {
        type: String,
        required: true
    },
    pet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet',
        required: true
    },
    shelterId: {
        type: String, 
        required: true
    },
    shelterName: { 
        type: String // not required to prevent old applications from crashing
    }, 
    petName: {
        type: String,
        required: true
    },
    livingSituation: {
        type: String,
        required: true
    },
    experienceDetails: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Draft', 'Pending', 'Approved', 'Rejected'],
        default: 'Draft'
    },
    applicationDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Application', applicationSchema);