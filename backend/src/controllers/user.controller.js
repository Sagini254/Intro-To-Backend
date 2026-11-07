import { User } from "../models/user.model.js";

const isValidPassword = (password) =>
  typeof password === "string" &&
  password.length >= 6 &&
  Buffer.byteLength(password, "utf8") <= 72;

const registerUser = async (req, res) => {
  try {
    const { username, password, email } = req.body ?? {};

    if (
      typeof username !== "string" ||
      typeof email !== "string" ||
      !username.trim() ||
      !email.trim() ||
      !isValidPassword(password)
    ) {
      return res.status(400).json({
        message:
          "A username and email are required; password must be 6-72 UTF-8 bytes",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const user = new User({
      username: username.trim(),
      password,
      email: normalizedEmail,
    });
    await user.save();

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: "Username or email is already in use" });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    console.error("Error registering user:", error);
    return res.status(500).json({
      message: "Error registering user",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    if (
      typeof email !== "string" ||
      !email.trim() ||
      !isValidPassword(password)
    ) {
      return res.status(400).json({
        message: "Email is required; password must be 6-72 UTF-8 bytes",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({
      message: "Error logging in user",
    });
  }
};

const logoutuser = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Implement logout logic here (e.g., clearing session or token)
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Error logging out user:", error);
    return res.status(500).json({
      message: "Error logging out user",
    });
  }
};
// Implement logout logic here (e.g., clearing session or token)
export { registerUser, loginUser };
