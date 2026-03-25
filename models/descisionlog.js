const mongoose = require('mongoose');

const descisionLogSchema = new mongoose.Schema({
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    pet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet',
        required: true
    },
    livingSituation: {
        type: String,
        required: false // Not required initially so users can save incomplete drafts
    },
    experienceDetails: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ['Draft', 'Pending', 'Approved', 'Rejected'],
        default: 'Draft'
    },
    applicationDate: {
        type: Date,
        default: Date.now
    },
    shelterName:{
        type: String,
        required: true
    }


});

const Descisionlog = mongoose.model('DescisionLog', descisionLogSchema, 'descisionLog');

exports.retrievePending = function (shelterName) {
    return Descisionlog.find ( { shelterName: {$in: [ shelterName ]}, status: {$in: ['Pending']} } );
};

exports.retrieveAll = function () {
    return Descisionlog.find()
};

