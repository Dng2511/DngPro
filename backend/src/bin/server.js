const app = require("../apps/app");
const bcrypt = require("bcrypt");
const UserModel = require("../apps/models/user");



const server = app.listen(port = process.env.PORT, (req, res) => {
    console.log("Run in " + port);
    // Create an admin account if none exists
    (async function createAdminIfNotExists() {
        try {
            const adminEmail = "admin@localhost";
            const adminPassword = "123456";

            // If any admin account exists, do nothing
            const anyAdmin = await UserModel.findOne({ role: "admin" });
            if (anyAdmin) {
                console.log("Admin user already exists:", anyAdmin.email);
                return;
            }

            const hashed = await bcrypt.hash(adminPassword, 10);
            const admin = new UserModel({
                email: adminEmail,
                password: hashed,
                role: "admin",
                full_name: "Administrator",
            });
            await admin.save();
            console.log("Created admin user:", adminEmail);
        } catch (err) {
            console.error("Failed to create admin user:", err);
        }
    })();
});