
const jwt = require('jsonwebtoken'); 

const auth = (req, res, next) => {
  const token = req.header('Authorization'); // Expecting 'Bearer <token>'
  console.log(token);

  if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {

      const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
       // Verify the token
       console.log(decoded);
      req.user = { userID: decoded.id, role: decoded.role }; 
      next(); 
  } catch (error) {
      res.status(401).json({ message: 'Token is not valid' });
      console.log(error);
  }
};

module.exports = auth;