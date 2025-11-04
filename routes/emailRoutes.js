// routes/emailRoutes.js
import express from "express";
import { sendEmailsHandler } from "../controllers/emailController.js";

const router = express.Router();

// POST /api/email/send
router.post("/send", sendEmailsHandler);

export default router;
