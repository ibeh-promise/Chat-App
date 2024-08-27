module.exports.jwt = (req, res) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).json({ message: "Invalid token" });
      } else {
        res.status(200).json({ message: "Token is valid" });
      }
    });
  } else {
    res.status(401).json({ message: "No token provided" });
  }
}