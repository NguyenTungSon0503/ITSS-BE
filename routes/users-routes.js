import express from "express";
import {
  getUsers,
  createUser,
  deleteUsers,
  updateProfile,
} from "../controllers/userController.js";
import authenticateToken from "../middleware/authorization.js";

const router = express.Router();
router.use(express.json());

/* GET users listing. */
router.get("/", authenticateToken, getUsers);

// Register user and return token
router.post("/", createUser);
/**
 * @swagger
 * /api/users/update:
 *   post:
 *     description: Update user profile
 *     parameters:
 *       - name: authorization
 *         in: header
 *         description: Bearer token
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: accessToken
 *         in: cookie
 *         description: Access token
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: name
 *         description: name
 *         in: formData
 *         required: true
 *         type: string
 *       - name: nation
 *         description: nation
 *         in: formData
 *         required: true
 *         type: string
 *       - name: location
 *         description: location
 *         in: formData
 *         required: true
 *         type: string
 *       - name: sex
 *         description: sex
 *         in: formData
 *         required: true
 *         type: string
 *       - name: age
 *         description: age
 *         in: formData
 *         required: true
 *         type: string
 *       - name: bio
 *         description: bio
 *         in: formData
 *         type: string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   format: i
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *                   example: $2b$10$Rk8sGUJqy63HVn0t0
 *                 role:
 *                   type: string
 
 *                 name:
 *                   type: string
 * 
 *                 nation:
 *                   type: string
 *  
 *                 location:
 *                   type: string
 *
 *                 sex:
 *                   type: strin
 *                 age:
 *                   type: integer
 *                   format: in
 *                 bio:
 *                   type: strin
 *                 rating:
 *                   type: [number, null]
 *                 avatar:
 *                   type: string
 *                 
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                  
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                  
 */

router.post("/update", authenticateToken, updateProfile);

// Delete all users
router.delete("/", deleteUsers);

export default router;
