import express from "express";
import Item from "../models/Items.js";
import Orders from "../models/Orders.js";
import Contact from "../models/Contact.js";
import nodemailer from "nodemailer";

// Get all items
export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single item
export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create item
export const createItem = async (req, res) => {
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
export const updateItem = async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) return res.status(404).json({ message: "Item not found" });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete item
export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Demo check
export const democheck = async (req, res) => {
  try {
    console.log("democheck called");
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error in democheck:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Place order
export const placeOrder = async (req, res) => {
  console.log("place order called");

  try {
    const body = req.body;
    console.log("body", body);

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
};

// Get all orders
export const getOrder = async (req, res) => {
  try {
    const orders = await Orders.find();
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

// Contact form
export const contact = async (req, res) => {
  try {
    const { name, phone, email, subject, message } = req.body;

    if (!name || !phone || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    const newContact = new Contact({ name, phone, email, subject, message });
    await newContact.save();

    return res.status(200).json({
      success: true,
      message: "Message received successfully!",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get all contacts
export const getContact = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    if (!contacts || contacts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No contact messages found",
      });
    }

    console.log("Contacts fetched:", contacts.length);

    return res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({
      success: false,
      message: "Server Error while fetching contacts",
    });
  }
};

// Send email
export const sendEmail = async (req, res) => {
  console.log("Email Called");

  try {
    const { content } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "devanshjinraniya41@gmail.com",
        pass: "mtonrhqeigxyrjto", // Gmail app password
      },
    });

    const mailOptions = {
      from: '"Technical Hub by DV" <devanshjinraniya41@gmail.com>',
      to: content,
      subject: "New Email from Website",
      html: `<p>This email was sent by Devansh Jinraniya via your website contact form.</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ message: "Failed to send email", error: error.message });
  }
};
