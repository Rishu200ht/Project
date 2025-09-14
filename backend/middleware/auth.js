import jwt from "jsonwebtoken"; 

export function isAuthenticated(req, res, next) {
  const token = req.cookies.token;

  if (!token){
    return res.redirect("/login.html");
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.redirect("/login.html");
  }
}
