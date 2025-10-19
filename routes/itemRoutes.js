const express = require("express");
const router = express.Router();
const {
    democheck,
    placeOrder
} = require("../controllers/itemController");


router.get("/democheck" , democheck)

router.post("/orders" , placeOrder)

module.exports = router;
