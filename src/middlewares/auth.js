import jwt from 'jsonwebtoken'

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Token is missing' });
  }

  jwt.verify(authHeader, process.env.JWT_Secret_Key, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token is invalid or expired' });
    }

    req.user = user;
    next();
  });
}

