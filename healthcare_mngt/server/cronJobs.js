const cron = require("node-cron");
const sendEmail = require("../services/mailService");
const Appointment = require("../models/appointmentModel");

// Run every day at midnight (00:00)
cron.schedule("0 0 * * *", async () => {
  console.log("🔔 Checking for upcoming appointments...");

  const tomorrow = moment().add(1, "days").startOf("day").format("YYYY-MM-DD");

  const upcomingAppointments = await Appointment.find({
    date: tomorrow, // Ensure it matches your stored format
  });

  for (let appointment of upcomingAppointments) {
    const message = `Reminder: Your appointment with Dr. ${appointment.doctorInfo.firstName} ${appointment.doctorInfo.lastName} is tomorrow at ${appointment.time}.`;
    await sendEmail(
      appointment.userInfo.email,
      "Appointment Reminder",
      message
    );
  }
});
