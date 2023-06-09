import jwt from "jsonwebtoken";
import pool from "../db.js";

//decode to get information of user who is logging
function decodedToken(accessToken) {
  return new Promise((resolve) => {
    try {
      const decodedToken = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET
      );
      const email = decodedToken.email;
      pool
        .query("SELECT * FROM users WHERE email = $1", [email])
        .then((result) => {
          resolve(result.rows[0]);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  });
}

export default decodedToken;
