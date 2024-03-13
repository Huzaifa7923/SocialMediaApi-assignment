import jwt from 'jsonwebtoken'
import User from '../models/userModel.js';


// 201 => created
// 200 =>OK

// 400 => bad request
// 401 => Unoauthorised
// 404 => not found
// 403 => forbidded

// 500 => internal server 

const protect =async (req, res, next) => {
  let token;
//   console.log('inside protect ')
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //Get Token from header
      token = req.headers.authorization.split(" ")[1];

      //verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //   console.log(decoded);

      //get user from token
      req.user = await User.findById(decoded.id).select("-password");

      console.log('user: '+req.user);
      if (!req.user) {
        return res.status(401).json({message:'not authorised '});
      }
      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({error:error})
    }
  }
  if (!token) {
    console.log('token not present')
    res.status(500).json({error:err})
  }

};
export {protect}
