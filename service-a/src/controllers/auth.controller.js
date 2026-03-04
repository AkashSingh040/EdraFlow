const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const { generateToken } = require("../services/token.service");

exports.register = async (req, res) => {
  const { name, email, password, university } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already exists" });

  const hash = await bcrypt.hash(password, 10);

  await User.create({
    name,
    email,
    passwordHash: hash,
    university
  });

  res.json({ message: "User registered successfully" });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  const token = generateToken({
    userId: user._id,
    role: user.role
  });

  res.json({ token });
};