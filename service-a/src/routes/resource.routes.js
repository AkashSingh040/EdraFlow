const router = require("express").Router();
const { verifyToken } = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/role.middleware");
const controller = require("../controllers/resource.controller");

router.get("/", async (req, res) => {
  const Resource = require("../models/resource.model");
  const resources = await Resource.find({ status: "approved" });
  res.json(resources);
});

router.post(
  "/",
  verifyToken,
  controller.uploadMiddleware,
  controller.createResource
);

router.get("/pending", verifyToken, requireRole("admin"), controller.getPending);

router.patch("/:id", verifyToken, requireRole("admin"), controller.updateStatus);

module.exports = router;