const Application = require("../models/Application");
const Pet = require("../models/pet-model");

exports.showMyApplications = async (req, res) => {
  try {

    const myApplications = await Application.find({ applicant: req.session.user._id }).populate("pet").populate("shelterId");
    return res.render("myApplications", { applications: myApplications });
  } catch (error) {
    console.log(error);
    return res.render("error", { error });
  }
};

exports.displayApplyForm = async (req, res) => {
  try {

    let petId = req.query.petId;
    let petName = req.query.petName;

    const pet = await Pet.displayPetById(petId);
    
    if (!pet) {
      return res.status(404).send("Sorry, this pet is no longer available.");
    }
    
    return res.render("applyForm", { 
        petId: petId, 
        petName: petName, 
        shelterId: pet.shelterId, 
        error: undefined 
    });

  } catch (error) {
    console.log("Error loading apply form:", error);
    return res.status(500).send("The actual error is: " + error.message);
  }
};

exports.submitApplication = async (req, res) => {
  try {

    const petId = req.params.petId;
    const userId = req.session.user._id;

    const pet = await Pet.displayPetById(petId);
    
    if (!pet) {
        return res.status(404).send("Sorry, this pet could not be found.");
    }

    const existingApplication = await Application.findOne({
      pet: petId,
      applicant: userId
    });

    if (existingApplication) {
      return res.render("applyForm", {
        petId: petId,
        petName: pet.name,
        shelterId: pet.shelterId,
        error: "You have already started or submitted an application for this pet!"
      });
    }

    let livingSituation = req.body.livingSituation;
    let experienceDetails = req.body.experienceDetails;
    let action = req.body.action;
    let finalStatus = action === "submit" ? "Pending" : "Draft";

    if (action === "submit" && (!livingSituation || !experienceDetails.trim())) {
      return res.render("applyForm", {
        petId: petId,
        petName: pet.name,
        shelterId: pet.shelterId,
        error: "Both Living Situation and Experience Details are required to submit."
      });
    }

    let newApplication = new Application({
      applicant: userId,
      applicantName: req.session.user.username,
      pet: petId,
      shelterId: pet.shelterId, 
      petName: pet.name,
      livingSituation: livingSituation,
      experienceDetails: experienceDetails,
      status: finalStatus
    });

    await newApplication.save();
    return res.redirect("/applications/mine");
    
  } catch (error) {
    console.log("Error in submitApplication:", error);
    return res.status(500).send("The actual error is: " + error.message);
  }
};

exports.displayEditDraftForm = async (req, res) => {
  try {

    const application = await Application.findOne({
      _id: req.params.appId,
      applicant: req.session.user._id,
      status: "Draft"
    }).populate("pet");

    if (!application) {
      return res.redirect("/applications/mine");
    }

    return res.render("editApplyForm", { app: application, error: undefined });
  } catch (error) {
    console.log(error);
    return res.render("error", { error });
  }
};

exports.submitDraftEdit = async (req, res) => {
  try {

    let livingSituation = req.body.livingSituation;
    let experienceDetails = req.body.experienceDetails;
    let action = req.body.action;
    let finalStatus = action === "submit" ? "Pending" : "Draft";

    if (action === "submit" && (!livingSituation || !experienceDetails.trim())) {
      const application = await Application.findById(req.params.appId).populate("pet");
      return res.render("editApplyForm", {
        app: application,
        error: "All fields must be filled out to submit your draft."
      });
    }

    await Application.findOneAndUpdate(
      { _id: req.params.appId, applicant: req.session.user._id, status: "Draft" },
      {
        livingSituation: livingSituation,
        experienceDetails: experienceDetails,
        status: finalStatus,
        applicationDate: Date.now(),
        applicantName: req.session.user.username 
      }
    );

    return res.redirect("/applications/mine");
  } catch (error) {
    console.log(error);
    return res.render("error", { error });
  }
};

exports.deleteApplication = async (req, res) => {
  try {

    await Application.findOneAndDelete({
      _id: req.params.appId,
      applicant: req.session.user._id
    });

    return res.redirect("/applications/mine");
  } catch (error) {
    console.log(error);
    return res.render("error", { error });
  }
};

exports.viewAllShelterApplications = async (req, res) => {
  try {

    const currentShelterId = req.session.user._id;
    const allApps = await Application.find({ shelterId: currentShelterId }).populate("pet").populate("applicant");

    return res.render("viewapplications", { applications: allApps });

  } catch (error) {
    console.log("Error loading shelter applications:", error);
    return res.status(500).send("Error loading applications.");
  }
};