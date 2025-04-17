const sendEmail = require("./mailService");

sendEmail("mediswift.hms@gmail.com", "Test Email", "Hello! This is a test email.")
    .then(() => console.log("✅ Email function executed successfully."))
    .catch((err) => console.error("❌ Error in email function:", err));
