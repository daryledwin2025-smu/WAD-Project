const fs = require('fs/promises');

const Dashboard = require('../models/dashboard-model');

exports.showDashboard = async (req, res) => {
    try {
    let dashboardList = await Dashboard.retrieveAll();// fetch all the list    
    console.log(dashboardList);
    res.render("dashboard", { dashboardList }); // Render the EJS form view and pass the posts
    } catch (error) {
    console.error(error);
    res.send("Error reading database"); // Send error message if fetching fails
    } 
};