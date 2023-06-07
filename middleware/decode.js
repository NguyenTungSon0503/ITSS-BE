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
      const user_email = decodedToken.user_email;
      pool
        .query("SELECT * FROM users WHERE user_email = $1", [user_email])
        .then((result) => {
          // console.log(result.rows);
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
