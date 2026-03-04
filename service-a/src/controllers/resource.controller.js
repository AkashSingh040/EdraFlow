const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const Resource = require("../models/resource.model");

const storage = multer.memoryStorage();
exports.uploadMiddleware = multer({ storage }).single("file");

exports.createResource = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const streamUpload = () =>
    new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        }
      );
      stream.end(req.file.buffer);
    });

  try {
    const uploaded = await streamUpload();

    const resource = await Resource.create({
      title: req.body.title,
      description: req.body.description,
      subject: req.body.subject,
      fileUrl: uploaded.secure_url,
      uploadedBy: req.user.userId
    });

    res.status(201).json(resource);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPending = async (req, res) => {
  const resources = await Resource.find({ status: "pending" });
  res.json(resources);
};

exports.updateStatus = async (req, res) => {
  const { status } = req.body;

  const updated = await Resource.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  res.json(updated);
};