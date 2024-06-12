import User from "../model/User.js";
import Post from "../model/Post.js";

// @desc    Create a Request
// @route   POST /api/request/create
// @access  Private
export const createRequest = async (req, res) => {
    try {
        const user = req.user;
        const { requestee, post, additionalInfo } = req.body;

        // User who is Requesting
        const requester = user._id;

        if(user.accountType !== 'User') {
            return res.status(400).json({ message: "Only User can create request" });
        }

        if (requestee.toString() === requester.toString()) {
            return res.status(400).json({ message: "You can't request yourself" });
        }

        if(additionalInfo && additionalInfo.length > 1000) {
            return res.status(400).json({ message: "Additional Info exceeds 1000 characters" });
        }

        // User who is being Requested
        const requesteeUser = await User.findById(requestee);

        if (!requesteeUser) {
            return res.status(400).json({ message: "Requestee not found" });
        }
        
        let postObj = null
        if(post) {
            postObj = await Post.findById(post);
    
            if (!postObj) {
                return res.status(400).json({ message: "Post not found" });
            }

            if (postObj.status !== 'Pending') {
                return res.status(400).json({ message: "Post is not pending" });
            }
        }

        let requestType = '';

        if (post) {
            requestType = 'Post'
        } else {
            if (requesteeUser.accountType === 'Hospital') 
                requestType = 'Hospital'
            else if (requesteeUser.accountType === 'User')
                requestType = 'User'
        }

        if(requestType === '') {
            return res.status(400).json({ message: "Invalid request type" });
        }

        const payload = {
            requestee,
            requester,
            requestType
        }

        if(post) {
            payload.post = post;
        }

        if(additionalInfo) {
            payload.additionalInfo = additionalInfo;
        }

        await Request.create(payload);
        if(post && postObj) {
            postObj.users.push(user?._id);
            await postObj.save();
        }

        res.status(201).json({ success: true, message: "Request created successfully" });

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}