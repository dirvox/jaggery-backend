const { response } = require("express");
const Item = require("../models/Items");
const Orders = require("../models/Orders");

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


const placeOrder = async (req , res) => {

    console.log("place order called ")
     try {
    const body = req.body;

    console.log("body " , body)
    
    if (!body.product || !body.product.id || !body.user) {
      return res.status(400).json({ success: false, message: "Missing required order fields." });
    }

    
    const quantity = Number(body.quantityKg) || 1;
    const pricePerKg = Number(body.product.pricePerKg) || 0;
    const expectedTotal = Number((pricePerKg * quantity).toFixed(2));

    
    const orderData = {
      product: {
        id: body.product.id,
        name: body.product.name,
        pricePerKg: pricePerKg,
        mrpPerKg: body.product.mrpPerKg,
      },
      quantityKg: quantity,
      priceBreakup: {
        totalPrice: expectedTotal,
        discountPercent: body.priceBreakup?.discountPercent || 0,
      },
      user: {
        name: body.user.name,
        phone: body.user.phone,
        email: body.user.email,
        address: body.user.address,
      },
      paymentMethod: body.paymentMethod || "cod",
      notes: body.notes || "",
    };

    const order = new Orders(orderData);
    await order.save();

    return res.status(201).json({ success: true, orderId: order._id, message: "Order created" });
  } catch (err) {
    console.error("Order create error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

const getOrder = async (req, res) => {
  try {
    const orders = await Orders.find(); // ✅ add await

    console.log("orders:", orders);

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching orders",
    });
  }
};

 
module.exports = {
    getAllItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem,
    democheck,
    placeOrder,
    getOrder
};
