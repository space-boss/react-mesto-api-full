const jwt = require('jsonwebtoken');

const JWT_SECRET = 'St6eEoT/FZ4qLBoBz579rFkjKtyOEk/Mv8hYVA==LmntOqd48Bkz0v6fAcLcQm/Z';
const { User } = require('../models/User');

const getJwtToken = (_id) => jwt.sign({ _id }, JWT_SECRET);

/*const isAuthorized = (token) => jwt.verify(token, JWT_SECRET, (error, decoded) => {
  if (error) return false;

  return User.findOne({ _id: decoded.id })
    .then((user) => Boolean(user));
});*/

const isAuthorized = (req, res, next) => {
  const token = req.cookies.token;
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET)
  } catch (e) {
    return res.status(401).send('Authorization needed');
  }
  req.user = payload;
  next();
};

module.exports = { getJwtToken, isAuthorized };
