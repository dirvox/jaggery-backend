const { response } = require("express");
const Item = require("../models/Items");

// Get all items
const getAllItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get single item
const getItemById = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ message: "Item not found" });
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create item
const createItem = async (req, res) => {
    const { name, price } = req.body;
    const newItem = new Item({ name, price });
    try {
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update item
const updateItem = async (req, res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedItem) return res.status(404).json({ message: "Item not found" });
        res.json(updatedItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete item
const deleteItem = async (req, res) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ message: "Item not found" });
        res.json({ message: "Item deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// controllers/itemController.js
const democheck = async (req, res) => {
  try {
    console.log("democheck called"); // logs whenever the route is hit
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error in democheck:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};


module.exports = {
    getAllItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem,
    democheck
};
