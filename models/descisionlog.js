const mongoose = require('mongoose');

const descisionLogSchema = new mongoose.Schema({
    applicant: {
        type: String,
        ref: 'User',
        required: true
    },
    applicantName: {
        type: String,
        required: true
    },
    pet: {
        type: String,
        ref: 'Pet',
        required: true
    },
    petName: {
        type: String,
        required: true
    },
    livingSituation: {
        type: String,
        required: true // Not required initially so users can save incomplete drafts
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
        required: true
    },
    shelterId:{
        type: String,
        required: false
    },
    comments:{
        type: String,
        required: false
    },
    descisionDateTime:{
        type: Date,
        default: Date.now
    }


});

const Descisionlog = mongoose.model('DescisionLog', descisionLogSchema, 'descisionLogs');

module.exports = Descisionlog

exports.retrievePending = function (shelterName) {
    return Descisionlog.find ( { shelterId: {$in: [ shelterName ]}, status: {$in: ['Pending']} } );
};

exports.retrieveAll = function () {
    return Descisionlog.find()
};

