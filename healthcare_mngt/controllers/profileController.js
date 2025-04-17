const userModel = require("../models/userModels");

const getUserProfileController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error(`Error in getUserProfileController: ${error.message}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const updateUserProfileController = async (req, res) => {
  try {
    console.log("Update request received:", req.body);
    console.log("Authenticated User ID:", req.user.id);

    const { name, phone, address, gender } = req.body;

    const updatedUser = await userModel
      .findByIdAndUpdate(
        req.user.id,
        { name, phone, address, gender },
        { new: true }
      )
      .select("-password");

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    console.log("Updated user:", updatedUser);
    res
      .status(200)
      .json({
        success: true,
        message: "Profile Updated Successfully",
        data: updatedUser,
      });
  } catch (error) {
    console.error(`Error in updateUserProfileController: ${error.message}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { getUserProfileController, updateUserProfileController };
