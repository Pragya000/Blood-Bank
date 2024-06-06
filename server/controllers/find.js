/* eslint-disable no-undef */
import User from "../model/User.js";

// @desc    Function to get pipeline for aggregation
const getPipeline = (
  userLocationCoordinates,
  maxDistanceInMeters,
  type,
  page,
  limit,
  userId
) => {
  let queryPipeline = [];

  if (maxDistanceInMeters) {
    queryPipeline.push({
      $geoNear: {
        near: {
          type: "Point",
          coordinates: userLocationCoordinates,
        },
        distanceField: "distance",
        maxDistance: parseInt(maxDistanceInMeters),
        spherical: true,
      },
    });
    queryPipeline.push({
      $match: {
        _id: {
          $ne: userId,
        }
      }
    })
    queryPipeline.push({
      $sort: {
        distance: 1,
        createdAt: -1,
      },
    });
  } else {
    queryPipeline.push({
      $match: {
        _id: {
          $ne: userId,
        }
      }
    })
    queryPipeline.push({
      $sort: {
        createdAt: -1,
      },
    });
  }

  let project = {
    _id: 1,
    name: 1,
    profilePic: 1,
    createdAt: 1,
    updatedAt: 1,
  }

  if (type === "Hospital") {
    project = {
        ...project,
        "additionalFields.hospitalName": 1,
        "additionalFields.hospitalAddress": 1,
        "additionalFields.hospitalContact": 1,
        "additionalFields.city": 1
    }
  } else {
    project = {
        ...project,
        "additionalFields.bloodType": 1,
        "additionalFields.rhFactor": 1,
        "additionalFields.city": 1,
        "additionalFields.gender": 1,
        "additionalFields.dateOfBirth": 1,
    }
  }

  const rest = [
    {
      $match: {
        accountType: type,
      },
    },
    {
      $skip: parseInt(page) * parseInt(limit),
    },
    {
      $limit: parseInt(limit),
    },
    {
        $project: project
    }
  ];

  queryPipeline.push(...rest);

  return queryPipeline;
};

// @desc    Find donors
// @route   POST /api/find/donors
// @access  Private
export const findDonors = async (req, res) => {
  try {
    const { maxDistanceInMeters, page = 0, limit = 12 } = req.query;
    const user = req.user;

    const userLocationCoordinates = user.additionalFields.location.coordinates;

    const queryPipeline = getPipeline(
      userLocationCoordinates,
      maxDistanceInMeters,
      "User",
      page,
      limit,
      user._id
    );

    const donors = await User.aggregate(queryPipeline);

    const result = {
      success: true,
      donors: donors,
    };

    if (parseInt(page) > 0) {
      result.previous = {
        pageNumber: parseInt(page) - 1,
        limit: parseInt(limit),
      };
      result.isPrev = true;
    } else {
      result.previous = {
        page: null,
        limit: null,
      };
      result.isPrev = false;
    }

    if (result.donors.length === parseInt(limit)) {
      result.next = {
        pageNumber: parseInt(page) + 1,
        limit: parseInt(limit),
      };
      result.isNext = true;
    } else {
      result.next = {
        pageNumber: null,
        limit: null,
      };
      result.isNext = false;
    }

    result.rowsPerPage = parseInt(limit);

    res.status(200).json(result);
  } catch (error) {
    console.log("Error in findDonors", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// @desc    Find hospitals
// @route   POST /api/find/hospitals
// @access  Private
export const findHospitals = async (req, res) => {
  try {
    const { maxDistanceInMeters, page = 0, limit = 12 } = req.query;
    const user = req.user;

    const userLocationCoordinates = user.additionalFields.location.coordinates;

    const queryPipeline = getPipeline(
      userLocationCoordinates,
      maxDistanceInMeters,
      "Hospital",
      page,
      limit,
      user._id
    );

    const hospitals = await User.aggregate(queryPipeline);

    const result = {
      success: true,
      hospitals: hospitals,
    };

    if (parseInt(page) > 0) {
      result.previous = {
        pageNumber: parseInt(page) - 1,
        limit: parseInt(limit),
      };
      result.isPrev = true;
    } else {
      result.previous = {
        page: null,
        limit: null,
      };
      result.isPrev = false;
    }

    if (result.hospitals.length === parseInt(limit)) {
      result.next = {
        pageNumber: parseInt(page) + 1,
        limit: parseInt(limit),
      };
      result.isNext = true;
    } else {
      result.next = {
        pageNumber: null,
        limit: null,
      };
      result.isNext = false;
    }

    result.rowsPerPage = parseInt(limit);

    res.status(200).json(result);
  } catch (error) {
    console.log("Error in findHospitals", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
