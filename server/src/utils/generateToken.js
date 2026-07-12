import jwt from "jsonwebtoken";
import config from "../config/index.js";
 
// Creates a signed JWT containing the user's ID and their tenant's ID.
// Both are needed on every future authenticated request: the user ID to
// know WHO is making the request, and the tenant ID to know WHICH
// tenant's data they're allowed to touch.
//
// "Signed" means the token can't be tampered with — if anyone edits the
// payload without knowing your JWT_SECRET, verifying it will fail.
const generateToken = (userId, tenantId) => {
  return jwt.sign({ id: userId, tenant: tenantId }, config.jwtSecret, {
    expiresIn: "7d",
  });
};
 
export default generateToken;
 