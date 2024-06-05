/* eslint-disable no-undef */
import Post from "../model/Post.js";
import User from "../model/User.js";
import { calculateAge } from "../utils/calculateAge.js";
import { decryptData } from "../utils/decodeEncode.js";
const MONGO_FIELD_KEY = process.env.MONGO_FIELD_ENCRYPTION_SECRET;

// @desc   Create Post
// route   POST /api/posts/create-post
// access  Private
export const createPost = async (req, res) => {
    try {
        const user = req.user;

        if(user?.accountType !== 'User' && user?.accountType !== 'Hospital') {
            return res.status(400).json({ success: false, error: "You are not authorized to create a post" });
        }

        const {additionalInfo} = req.body;
        const userLocationCoordinates = user.additionalFields.location.coordinates;
        let payload = {
            user: user?._id,
            location: {
                type: 'Point',
                coordinates: userLocationCoordinates
            }
        }
        if (additionalInfo) {
            payload['additionalInfo'] = additionalInfo
        }


        if(user.accountType === 'Hospital') {
            const {timing, totalSeats} = req.body;

            if(!timing || !totalSeats) {
                return res.status(400).json({ success: false, error: "Please provide all the fields" });
            }

            if(isNaN(totalSeats) || totalSeats < 1) {
                return res.status(400).json({ success: false, error: "Invalid Total Seats" });
            }

            if(isNaN(new Date(timing).getTime())) {
                return res.status(400).json({ success: false, error: "Invalid Timing" });
            }

            payload['type'] = 'Camp'; 
            payload['timing'] = new Date(timing);
            payload['totalSeats'] = totalSeats;
            payload['requestStatus'] = 'NA';
        } else {
            payload['type'] = 'Request'
            payload['requestStatus'] = 'Pending';
        }

        const post = await Post.create(payload);
        await User.findByIdAndUpdate(user._id, { $push: { posts: post._id } });
        
        return res.status(201).json({ success: true, message: "Post Created Successfully" });


    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}

// @desc   Get Posts
// route   GET /api/posts/get-posts
// access  Private
export const getPosts = async (req, res) => {
    try {
      const user = req.user;  
      const { page = 0, limit = 10, maxDistanceInMeters, type } = req.query;
      let query = [];

      if (maxDistanceInMeters) {
        query.push({
          $geoNear: {
            near: {
              type: "Point",
              coordinates: user.additionalFields.location.coordinates,
            },
            distanceField: "distance",
            maxDistance: Number(maxDistanceInMeters),
            spherical: true,
          },
        });

        query.push({
          $sort: { 
            distance: 1,
            createdAt: -1
          }
        })
      }

      if (!maxDistanceInMeters) query.push({ $sort: { createdAt: -1 } })

      if(type) {
        if(type !== 'request' && type !== 'camp') {
            return res.status(400).json({ success: false, error: "Invalid Type" });
        }
        query.push({
          $match: { type: type.charAt(0).toUpperCase() + type.slice(1)},
        });
      }

      query.push({
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      })

      query.push({
        $skip: parseInt(page) * parseInt(limit),
      })

      query.push({
        $limit: parseInt(limit),
      })
  
      // if (maxDistanceInMeters) {
      //   const userCoordinates = user.additionalFields.location.coordinates;
      //   query.location = {
      //     $near: {
      //       $geometry: {
      //         type: "Point",
      //         coordinates: [userCoordinates[0], userCoordinates[1]],
      //       },
      //       $maxDistance: Number(maxDistanceInMeters),
      //     },
      //   };
      // }

      // if(type) {
      //   if(type !== 'Request' && type !== 'Camp') {
      //       return res.status(400).json({ success: false, error: "Invalid Type" });
      //   }
      //   query['type'] = type;
      // }

      // const posts = await Post.aggregate(query)
      //   .populate("user", "name profilePic accountType additionalFields")
      //   .sort({ createdAt: -1 })
      //   .skip((page - 1) * limit)
      //   .limit(parseInt(limit));

      const posts = await Post.aggregate(query)

      let result = {
        success: true,
      }

      result.posts = posts.map((post)=>{
        const modifiedPost = post;
        delete modifiedPost.location;
        modifiedPost.user = modifiedPost.user[0];
        delete modifiedPost.user.password
        delete modifiedPost.user.email
        delete modifiedPost.user.posts
        if(modifiedPost.user.accountType === 'Hospital') {
          modifiedPost.user.additionalFields = {
            hospitalName: modifiedPost.user.additionalFields.hospitalName,
            hospitalAddress: modifiedPost.user.additionalFields.hospitalAddress,
            city: modifiedPost.user.additionalFields.city
          }
        } else {
          const dob = decryptData(modifiedPost.user.additionalFields.dateOfBirth, MONGO_FIELD_KEY);
          const age = calculateAge(dob);

          modifiedPost.user.additionalFields = {
            bloodType: decryptData(modifiedPost.user.additionalFields.bloodType, MONGO_FIELD_KEY),
            rhFactor: decryptData(modifiedPost.user.additionalFields.rhFactor, MONGO_FIELD_KEY),
            gender: modifiedPost.user.additionalFields.gender,
            city: modifiedPost.user.additionalFields.city,
            age: age
        }
        }
        return modifiedPost;
      })

        if (parseInt(page) > 0)
        {
          result.previous = {
            pageNumber: parseInt(page) - 1,
            limit: parseInt(limit)
          }
          result.isPrev = true
        }
        else
        {
          result.previous = {
            page: null,
            limit: null
          }
          result.isPrev = false
        }

        if (result.posts.length === parseInt(limit))
        {
          result.next = {
            pageNumber: parseInt(page) + 1,
            limit: parseInt(limit)
          }
          result.isNext = true
        }
        else 
        {
          result.next = {
            pageNumber: null,
            limit: null
          }
          result.isNext = false
        }

        result.rowsPerPage = parseInt(limit);
  
      // const total = await Post.countDocuments(query);

      // const modifiedPosts = posts.map(post => {
      //   let modifiedPost = post.toObject();
      //   const postAuthor = modifiedPost.user;
      //   if(postAuthor.accountType === 'Hospital') {
      //       postAuthor.additionalFields = {
      //           hospitalName: postAuthor.additionalFields.hospitalName,
      //           hospitalAddress: postAuthor.additionalFields.hospitalAddress,
      //           city: postAuthor.additionalFields.city
      //       }
      //   } else {
      //       const dob = decryptData(postAuthor.additionalFields.dateOfBirth, MONGO_FIELD_KEY);
      //       const age = calculateAge(dob);

      //       postAuthor.additionalFields = {
      //           bloodType: decryptData(postAuthor.additionalFields.bloodType, MONGO_FIELD_KEY),
      //           rhFactor: decryptData(postAuthor.additionalFields.rhFactor, MONGO_FIELD_KEY),
      //           gender: postAuthor.additionalFields.gender,
      //           city: postAuthor.additionalFields.city,
      //           age: age
      //       }
      //   }
      //   delete modifiedPost.location;
      //   modifiedPost.user = postAuthor;
      //   return modifiedPost;
      // })
  
      res.json(result);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error: "Something went wrong" });
    }
};