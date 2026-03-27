const Application = require("../models/Application");
// const Pet = require("../models/Pet");

exports.showMyApplications = async (req, res) => {
  try {
    if (!req.session || !req.session.user) {
      return res.redirect("/");
    }

    const myApplications = await Application.find({ applicant: req.session.user._id }).populate("pet");
    const validApplications = myApplications.filter(app => app.pet !== null);  
    // handle cases when listing is deleted after application submitted

    return res.render("myApplications", { applications: validApplications});
  } catch (error) {
    console.log(error);
    return res.render("error", { error });
  }
};

exports.displayApplyForm = async (req, res) => {
  try{
    let petId = req.query.petId;
    let petName = req.query.petName;
    res.render("applyForm",{petId:petId,petName:petName})
  } catch(error){

  }
  // try {
  //   if (!req.session || !req.session.user) {
  //     return res.redirect("/user-login");
  //   }

  //   const pet = await Pet.findById(req.params.petId);
  //   if (!pet) {
  //     return res.redirect("/browse");
  //   }
    
  //   return res.render("applyForm", { pet: pet, error: undefined });
  // } catch (error) {
  //   console.log(error);
  //   return res.render("error", { error });
  // }
};

exports.submitApplication = async (req, res) => {
  try {
    if (!req.session || !req.session.user) {
      return res.redirect("/");
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
      return res.redirect("/");
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
      return res.redirect("/");
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
      return res.redirect("/");
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

exports.viewPetApplications = async (req, res) => {
  try {
    if (!req.session || !req.session.user) {
      return res.redirect("/user-login");
    }

    // 1. Find the specific pet
    const pet = await Pet.findById(req.params.petId);
    if (!pet) {
      return res.redirect("/pets/myListings");
    }

    // 2. Find all applications for this pet AND grab the applicant's user info (name/email)
    const applications = await Application.find({ pet: req.params.petId }).populate("applicant");

    // 3. Render the view with both pieces of data
    return res.render("viewApplications", { pet: pet, applications: applications });
  } catch (error) {
    console.log("Error loading applications for pet:", error);
    return res.render("error", { error });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    if (!req.session || !req.session.user) {
      return res.redirect("/user-login");
    }

    const newStatus = req.body.newStatus; // 'Approved' or 'Rejected' coming from the button

    // Find the application and update its status
    const application = await Application.findByIdAndUpdate(
      req.params.appId,
      { status: newStatus },
      { new: true } // Returns the updated document
    );

    // Redirect the shelter back to the same pet's application list
    return res.redirect(`/applications/pet/${application.pet}`);
  } catch (error) {
    console.log("Error updating application status:", error);
    return res.render("error", { error });
  }
};

exports.displayViewApplicationsByPet = async (req,res)=>{
  try {
    if (!req.session || !req.session.user) {
      return res.redirect("/");
    }
    const petId = req.query.petId;
    const petName = req.query.petName;
    console.log(petName)
    const myApplications = await Application.find({ pet: petId }).populate("pet");
    const validApplications = myApplications.filter(app => app.pet !== null);  
    // handle cases when listing is deleted after application submitted
    console.log(validApplications)
    return res.render("viewApplications", { applications: validApplications,petName:petName});
  } catch (error) {
    console.log(error);
    return res.render("error", { error });
  }
}