const ProcedureFlow = require("../models/procedure.model");
const axios = require("axios");

exports.createProcedure = async (req, res) => {
  const procedure = await ProcedureFlow.create(req.body);
  res.status(201).json(procedure);
};

exports.publishProcedure = async (req, res) => {
  const procedure = await ProcedureFlow.findById(req.params.id);

  procedure.status = "published";
  await procedure.save();

  await axios.post(`${process.env.EDRABOT_URL}/embed-procedure`, {
    id: procedure._id,
    title: procedure.title,
    university: procedure.university,
    officialSteps: procedure.officialSteps,
    researchInsights: procedure.researchInsights,
    commonDelays: procedure.commonDelays,
    tips: procedure.tips,
    version: procedure.version
  });

  res.json({ message: "Published & sent to AI" });
};