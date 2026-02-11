const userModal = require("../../modals/user.modal");

const getMyProfileController = async (req, res) => {
  try {
    // Middleware already attaches req.user
    res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      user: req.user, // Send req.user directly
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching user profile",
      error: error.message,
    });
  }
};

const updateMyProfileController = async (req, res) => {
  try {
    const { name, email } = req.body;
    const updatedData = {};

    if (name) updatedData.name = name;
    if (email) updatedData.email = email;
    const user = await userModal.findByIdAndUpdate(
      req.user._id,  // ✅ Fixed: use req.user._id instead of req.userId
      { $set: updatedData },
      { new: true }
    ).select("-password");
    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating user profile",
      error: error.message,
    });
  }
};

module.exports = {
  getMyProfileController, updateMyProfileController
};