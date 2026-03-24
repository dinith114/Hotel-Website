const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Admin = require("./models/Admin");

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected...");

    // Check if admin already exists
    const adminExists = await Admin.findOne({ email: "admin@hotel.com" });

    if (adminExists) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    // Create initial super admin
    await Admin.create({
      name: "Super Admin",
      email: "admin@hotel.com",
      password: "Admin@123456",
      role: "super_admin",
      isActive: true,
    });

    console.log("Super Admin created successfully");
    console.log("Email: admin@hotel.com");
    console.log("Password: Admin@123456");
    console.log("\n IMPORTANT: Please change this password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

seedAdmin();
