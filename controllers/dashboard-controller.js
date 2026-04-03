const Dashboard = require('../models/descisionlog');
const Application = require('../models/Application');


exports.showApplications = async (req, res) => {
        const applicationID = req.params.id;
        let applications = await Application.findById(applicationID).populate('pet');
        applications = [applications];
        res.render("applicationDetails", {applications});
};

exports.showDashboard = async (req, res) => {
    try {
    let shelterName = req.session.user._id;
    const petFilter = req.query.pet;
    let dashboardList = await Application.find ( { shelterId: {$in: [ shelterName ]}, status: {$in: ['Pending']} } ).populate('pet').populate('applicant');
    let filterList = await Application.find ( { shelterId: {$in: [ shelterName ]}, status: {$in: ['Pending']} } ).populate('pet').populate('applicant');

    
    
    if(petFilter){
        dashboardList = await Application.find ( { shelterId: {$in: [ shelterName ]}, status: {$in: ['Pending']},} ).populate({path: 'pet', match: {name: petFilter}  }).populate('applicant');
    }else{
        dashboardList = await Application.find ( { shelterId: {$in: [ shelterName ]}, status: {$in: ['Pending']} } ).populate('pet').populate('applicant');
    };
    
    if(dashboardList.length == 0){
        dashboardList = [];
    };
    res.render("dashboard", { dashboardList, filterList });
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
    const appName = req.body.appName;
    const petName = req.body.petName;
    try{
        await Dashboard.create({
            applicant: applicantID,
            pet: petID,
            livingSituation: livingSituation,
            experienceDetails: experienceDetails,
            status: descision,
            applicationDate: applicationDate,
            comments: comment,
            shelterId: shelterId,
            applicantName: appName,
            petName: petName
        });
        if(descision == "Approved"){
            await Application.updateMany({pet: {$in: [petID]}, _id: {$nin: [applicationID]}}, {$set: {status: "Rejected"}});
        };
        await Application.updateOne({_id: applicationID}, {$set: { status: descision }});
        
        console.log("Entry Updated!");
        console.log("Entry Created!");
        res.redirect("/dashboard");
    }catch(error){
        console.log(error);
    
    }};

exports.showDescisionLogs = async (req, res) => {
    try{
        let shelterName = req.session.user._id;
        let descisionlogs = await Dashboard.find({shelterId: {$in: [ shelterName ]}});
        if(!Array.isArray(descisionlogs)){
            descisionlogs = [descisionlogs];
        };
        res.render("descisionlogs", {descisionlogs});
    }catch(error){
        console.log(error);
    }};

exports.withdrawDescisionLog = async (req, res) => {
    try{
        const applicationId = req.query.applicationId;
        console.log(applicationId);
        const petId = req.query.petId;
        const shelterId = req.query.shelterId;
        
        await Dashboard.deleteOne({_id: {$in: [applicationId]} });
        await Application.updateMany({pet: {$in: [petId]}, shelterId: {$in: [shelterId]}}, {$set: {status: "Pending"}});
        res.redirect("/dashboard");
        
    }catch(error){
        console.log(error);
    }
}