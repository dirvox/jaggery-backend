import express from "express";
import {
  democheck,
  placeOrder,
  getOrder,
  contact,
  getContact,
  sendEmail,
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  sendOtpPhone,
  getOrderDetailByID

} from "../controllers/itemController.js";

const router = express.Router();

// ✅ Define routes **before** export
router.get("/democheck", democheck);

router.post("/orders", placeOrder);
router.get("/orders", getOrder);

router.post("/contact", contact);
router.get("/contact", getContact);

router.post("/send-email", sendEmail);

router.post("/send-otp", sendOtpPhone);

// Item CRUD
router.get("/items", getAllItems);
router.get("/items/:id", getItemById);
router.post("/items", createItem);
router.put("/items/:id", updateItem);
router.delete("/items/:id", deleteItem);

router.get("/order-details/:id" , getOrderDetailByID)

// ✅ Proper ESM export
export default router;
