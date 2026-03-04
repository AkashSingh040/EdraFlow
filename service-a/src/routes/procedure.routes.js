const router = require("express").Router();
const { verifyToken } = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/role.middleware");
const controller = require("../controllers/procedure.controller");

router.post("/", verifyToken, requireRole("admin"), controller.createProcedure);
router.patch("/:id/publish", verifyToken, requireRole("admin"), controller.publishProcedure);

router.get("/", async (req, res) => {
  const ProcedureFlow = require("../models/procedure.model");
  const procedures = await ProcedureFlow.find({ status: "published" });
  res.json(procedures);
});

module.exports = router;