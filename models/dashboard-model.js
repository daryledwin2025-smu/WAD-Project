const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A book must have a title']
        
    },
    pet: {
        type: String,
        required: [true, 'A book must have a isbn call number'],
        unique: true
    },
    rating: {
        type: Number,
        default: 3.0
    },
    price: {
        type: Number,
        required: [true, 'A book must have a price']
    }
});

const Dashboard = mongoose.model('Dashboard', dashboardSchema,'dashboard');

exports.retrieveAll = function() {

    return Dashboard.find();
};