let jwt = require('jsonwebtoken');
const project1_config = require('./project1_config.js');

let checkToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization'];
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }
  if (token) {
    jwt.verify(token, project1_config.secret, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Invalid Token'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.json({
      success: false,
      message: 'Authorisation token Required'
    });
  }
};

module.exports = {
  checkToken: checkToken
}