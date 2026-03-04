const mongoose = require("mongoose");

const procedureSchema = new mongoose.Schema({
  title: String,
  university: String,
  officialSteps: [String],
  researchInsights: [String],
  commonDelays: [String],
  tips: [String],
  version: { type: String, default: "1.0" },
  status: { type: String, enum: ["draft", "published"], default: "draft" }
}, { timestamps: true });

procedureSchema.index({ university: 1, title: 1 });

module.exports = mongoose.model("ProcedureFlow", procedureSchema);