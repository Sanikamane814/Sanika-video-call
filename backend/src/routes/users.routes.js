import { Router } from "express";
import { login, register,addToActivity, getAllActivity } from "../controllers/user.controllers.js"; // ✅


const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/add_to_activity", addToActivity);
router.get("/get_all_activity", getAllActivity);

export default router;


