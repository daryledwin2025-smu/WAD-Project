
const Dashboard = require('../models/descisionlog');
const Application = require('../models/Application')

exports.showDashboard = async (req, res) => {
    try {
    let dashboardList = await Dashboard.retrieveAll();    
    console.log(dashboardList);
    if(dashboardList.length == 0){
        dashboardList = ['There are no Applications.']
        res.render("dashboard", { dashboardList })
    }else{
        res.render("dashboard", { dashboardList }) };
    } catch (error) {
    console.error(error);
    res.send("Error reading database"); 
    } 
};

exports.showApplications = async (req, res) => {
    try {
    let applicationList = await Dashboard.retrievePending(shelterName);    
    console.log(applicationList);
    res.render("descisionLog", { applicationList }); 
    } catch (error) {
    console.error(error);
    res.send("Error reading database"); 
    } 
};

exports.showPage = (req, res) => {
    res.render("dashboard");
};