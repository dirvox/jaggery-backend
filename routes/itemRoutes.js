const express = require("express");
const router = express.Router();
const {
    democheck,
    placeOrder,
    getOrder
} = require("../controllers/itemController");


router.get("/democheck" , democheck)

router.post("/orders" , placeOrder)

router.get("/orders" , getOrder)

module.exports = router;
