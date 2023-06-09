import jwt from "jsonwebtoken";

function jwtTokens({ id, email }) {
  const user = { id, email };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "2h",
  });
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "5h",
  });
  return { accessToken, refreshToken };
}

export default jwtTokens;
