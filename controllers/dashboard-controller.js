const fs = require('fs/promises');

const Dashboard = require('../models/descisionlog');

exports.showDashboard = async (req, res) => {
    try {
    let dashboardList = await Dashboard.retrieveAll();    
    console.log(dashboardList);
    res.render("dashboard", { dashboardList }); 
    } catch (error) {
    console.error(error);
    res.send("Error reading database"); 
    } 
};

exports.showApplications = async (req, res) => {
    try {
    let applicationList = await Dashboard.retrievePending(shelterName);    
    console.log(applicationList);
    res.render("descionLog", { applicationList }); 
    } catch (error) {
    console.error(error);
    res.send("Error reading database"); 
    } 
};