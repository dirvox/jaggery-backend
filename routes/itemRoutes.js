const express = require("express");
const router = express.Router();
const {
    democheck,
    placeOrder,
    getOrder,
    contact,
    getContact
} = require("../controllers/itemController");


router.get("/democheck" , democheck)

router.post("/orders" , placeOrder)

router.get("/orders" , getOrder)

router.post("/contact" , contact )
router.get("/contact" , getContact )

module.exports = router;
