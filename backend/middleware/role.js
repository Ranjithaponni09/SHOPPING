module.exports = (role) => {
  return (req, res, next) => {
    const token =
      req.headers["x-auth-token"] ||
      (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ") &&
        req.headers.authorization.split(" ")[1]);

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      // verify JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // check role
      if (decoded.role !== role) {
        return res.status(403).json({ message: "Forbidden: Access denied" });
      }

      req.user = decoded;
      next();

    } catch (err) {
      return res.status(400).json({ message: "Invalid token" });
    }
  };
};
