const Application = require("../models/Application");
// const Pet = require("../models/Pet");

exports.showMyApplications = async (req, res) => {
  try {
    if (!req.session || !req.session.user) {
      return res.redirect("/user-login");
    }

    const myApplications = await Application.find({ applicant: req.session.user._id }).populate("pet");
    return res.render("myApplications", { applications: myApplications });
  } catch (error) {
    console.log(error);
    return res.render("error", { error });
  }
};

exports.displayApplyForm = async (req, res) => {
  try {
    if (!req.session || !req.session.user) {
      return res.redirect("/user-login");
    }

    const pet = await Pet.findById(req.params.petId);
    if (!pet) {
      return res.redirect("/browse");
    }
    
    return res.render("applyForm", { pet: pet, error: undefined });
  } catch (error) {
    console.log(error);
    return res.render("error", { error });
  }
};

exports.submitApplication = async (req, res) => {
  try {
    if (!req.session || !req.session.user) {
      return res.redirect("/user-login");
    }

    let livingSituation = req.body.livingSituation;
    let experienceDetails = req.body.experienceDetails;
    let action = req.body.action;
    let finalStatus = action === "submit" ? "Pending" : "Draft";

    if (action === "submit" && (!livingSituation || !experienceDetails.trim())) {
      const pet = await Pet.findById(req.params.petId);
      return res.render("applyForm", {
        pet: pet,
        error: "Both Living Situation and Experience Details are required to submit."
      });
    }

    let newApplication = new Application({
      applicant: req.session.user._id,
      pet: req.params.petId,
      livingSituation: livingSituation,
      experienceDetails: experienceDetails,
      status: finalStatus
    });

    await newApplication.save();
    return res.redirect("/applications/mine");
  } catch (error) {
    console.log(error);
    return res.render("error", { error });
  }
};

exports.displayEditDraftForm = async (req, res) => {
  try {
    if (!req.session || !req.session.user) {
      return res.redirect("/user-login");
    }

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
    if (!req.session || !req.session.user) {
      return res.redirect("/user-login");
    }

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
        applicationDate: Date.now()
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
    if (!req.session || !req.session.user) {
      return res.redirect("/user-login");
    }

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