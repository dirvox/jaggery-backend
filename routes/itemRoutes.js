const express = require("express");
const router = express.Router();
const {
    democheck
} = require("../controllers/itemController");

// Routes
// router.get("/", getAllItems);
// router.get("/:id", getItemById);
// router.post("/", createItem);
// router.put("/:id", updateItem);
// router.delete("/:id", deleteItem);
router.get("/democheck" , democheck)

module.exports = router;
