const ProcedureFlow = require("../models/procedure.model");
const axios = require("axios");

exports.createProcedure = async (req, res) => {
  const procedure = await ProcedureFlow.create(req.body);
  res.status(201).json(procedure);
};

exports.publishProcedure = async (req, res) => {
  try {
    const procedure = await ProcedureFlow.findById(req.params.id);

    if (!procedure) {
      return res.status(404).json({ message: "Procedure not found" });
    }

    procedure.status = "published";
    procedure.version = procedure.version || "1.0";

    await procedure.save();

    await axios.post(`${process.env.EDRABOT_URL}/embed-procedure`, {
      id: procedure._id.toString(),
      title: procedure.title,
      university: procedure.university,
      officialSteps: procedure.officialSteps,
      researchInsights: procedure.researchInsights,
      commonDelays: procedure.commonDelays,
      tips: procedure.tips,
      version: procedure.version
    });

    res.json({ message: "Published & sent to AI", procedure });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error publishing procedure" });
  }
};