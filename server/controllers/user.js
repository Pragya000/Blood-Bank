// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// @desc   Get User Profile
// route   GET /api/profile/user-details
// access  Private
export const getUserDetails = async (req, res) => {
    const user = req.user;
  
    user.password = undefined;
  
    res.status(200).json({
      success: true,
      message: "User Profile Fetched Successfully",
      data: {
        user,
      },
    });
  };