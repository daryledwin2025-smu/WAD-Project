const Dashboard = require('../models/descisionlog');
const Application = require('../models/Application');


exports.showApplications = async (req, res) => {
        const applicationID = req.params.id;
        let applications = await Application.findById(applicationID);
        applications = [applications];
        res.render("applicationDetails", {applications});
};

exports.showDashboard = async (req, res) => {
    try {
    let shelterName = req.session.user._id;
    let dashboardList = await Application.find ( { shelterId: {$in: [ shelterName ]}, status: {$in: ['Pending']} } );    
    if(dashboardList.length == 0){
        dashboardList = ['There are no Applications.'];
        res.render("dashboard", { dashboardList });
    }else{
        res.render("dashboard", { dashboardList }) };
    } catch (error) {
    console.error(error);
    res.send("Error reading database"); 
    } 
};

exports.updateApplicationDetails = async (req, res) => {
    const applicationID = req.body.applicationId;
    const applicantID = req.body.applicantId;
    const petID = req.body.petId;
    const livingSituation = req.body.living;
    const experienceDetails = req.body.exp;
    const applicationDate = req.body.appDT;
    const descision = req.body.descision;
    const comment = req.body.comment;
    const shelterId = req.body.shelterId;
    try{
        await Dashboard.create({
            applicant: applicantID,
            pet: petID,
            livingSituation: livingSituation,
            experienceDetails: experienceDetails,
            status: descision,
            applicationDate: applicationDate,
            comments: comment,
            shelterId: shelterId
        })
        await Application.updateOne({_id: applicationID}, {$set: { status: descision }});
        console.log("Entry Updated!");
        console.log("Entry Created!");
        res.redirect("/dashboard");
    }catch(error){
        console.log(error);
    
    }}

exports.showDescisionLogs = async (req, res) => {
    try{
        let shelterName = req.session.user._id;
        let descisionlogs = await Dashboard.find({shelterId: {$in: [ shelterName ]}});
        if(!Array.isArray(descisionlogs)){
            descisionlogs = [descisionlogs];
        };
        res.render("descisionlogs", {descisionlogs});
    }catch(error){

    }};
