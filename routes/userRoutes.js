import express from "express";
import {
  registerUser,
  logIn,
  confirmAccount,
  RequestPasswordChange,
  checkToken,
  changePassword,
  profile
} from "../controllers/userController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

//incio sesion, registro y confirmar usuarios
router.post("/", registerUser);
router.post("/logIn", logIn);
router.get("/confirm/:token", confirmAccount);
router.post("/forget-password", RequestPasswordChange);
router.route("/forget-password/:token").get(checkToken).post(changePassword);

router.get("/profile", checkAuth, profile);

export default router;
