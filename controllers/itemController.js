import express from "express";
import Item from "../models/Items.js";
import Orders from "../models/Orders.js";
import Contact from "../models/Contact.js";
import nodemailer from "nodemailer";
import axios from "axios";
import Joi from "joi";
import moment from "moment";
import md5 from "md5";

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
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedItem)
      return res.status(404).json({ message: "Item not found" });
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



export const placeOrder = async (req, res) => {
  try {
    const body = req.body;
    console.log("Order Body:", body);

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return res.status(400).json({ success: false, message: "No items in order." });
    }

    const orderData = {
      items: body.items,
      priceBreakup: body.priceBreakup,
      user: body.user,
      paymentMethod: body.paymentMethod || "cod",
      notes: body.notes || "",
    };

    const order = new Orders(orderData);
    await order.save();

    // notifications
    await sendEmailToUs(order);
    sendOrderToUsPhone();

    return res.status(201).json({
      success: true,
      orderId: order._id,
      message: "Order created successfully"
    });

  } catch (err) {
    console.error("Order Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const sendEmailToUs = async (order = {}) => {
  // console.log("Email Called");

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "devanshjinraniya41@gmail.com",
        pass: "mtonrhqeigxyrjto",
      },
    });

    // Safely extract fields
    const product = order.product || {};
    const user = order.user || {};
    const price = order.priceBreakup || {};

    const emailHTML = `
      <div style="width:100%; padding:20px; font-family:Arial, sans-serif;">
        <div style="max-width:600px; margin:auto; border:1px solid #ddd; border-radius:10px; padding:20px; background:#f9f9f9;">
          
          <h2 style="text-align:center; background:#FFD700; padding:15px; border-radius:10px;">
            🛒 New Order Received – Khatatuli Gud
          </h2>

          <p style="font-size:16px;">You received a new order from your website.</p>

          <h3 style="margin-top:20px;">📌 Order Details</h3>

          <table cellspacing="0" cellpadding="10" style="width:100%; border-collapse:collapse;">
            <tr><td><strong>Product Name:</strong></td><td>${product.name || "N/A"}</td></tr>
            <tr><td><strong>Price Per Kg:</strong></td><td>₹${product.pricePerKg || "0"}</td></tr>
            <tr><td><strong>MRP Per Kg:</strong></td><td>₹${product.mrpPerKg || "0"}</td></tr>
            <tr><td><strong>Quantity:</strong></td><td>${order.quantityKg || "0"} Kg</td></tr>
            <tr><td><strong>Total Price:</strong></td><td><strong>₹${price.totalPrice || "0"}</strong></td></tr>
            <tr><td><strong>Discount:</strong></td><td>${price.discountPercent || 0}%</td></tr>
          </table>

          <h3 style="margin-top:20px;">👤 Customer Details</h3>

          <table cellspacing="0" cellpadding="10" style="width:100%; border-collapse:collapse;">
            <tr><td><strong>Name:</strong></td><td>${user.name || "N/A"}</td></tr>
            <tr><td><strong>Phone:</strong></td><td>${user.phone || "N/A"}</td></tr>
            <tr><td><strong>Email:</strong></td><td>${user.email || "N/A"}</td></tr>
            <tr><td><strong>Address:</strong></td><td>${user.address || "N/A"}</td></tr>
          </table>

          <h3 style="margin-top:20px;">💳 Payment</h3>
          <p><strong>Method:</strong> ${(order.paymentMethod || "N/A").toUpperCase()}</p>

          <h3>📝 Notes</h3>
          <p>${order.notes || "No additional notes"}</p>

          <hr style="margin:20px 0;" />
          
          <p style="text-align:center; font-size:14px; color:#555;">
            © 2025 Khatatuli Gud – All Rights Reserved
          </p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: "Khatatuli Gud <devanshjinraniya41@gmail.com>",
      to: "devanshjinraniya46@gmail.com",
      subject: `🛍 New Order Received – ${user.name || "Customer"}`,
      html: emailHTML,
    };

    await transporter.sendMail(mailOptions);
    // console.log("EMAIL SENT SUCCESSFULLY");
  } catch (error) {
    console.error("Email send error:", error);
  }
};


const sendOrderToUsPhone = async () => {
  console.log("caled ");
  try {
    // Validate phone
    // const schema = Joi.object({
    //   phone: Joi.string().length(10).required(),
    // });

    // const { error } = schema.validate(req.body);
    // if (error) {
    //   return res.status(400).json({
    //     status: false,
    //     message: error.details[0].message,
    //   });
    // }

    // const { phone } = req.body;
    // console.log("phone is ", phone);

    const phone = "9368431474";

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    const now = Date.now();
    const timeEnd = moment().add(1, "minute").valueOf();

    // Signature
    const apiKey = "yFflv72N";
    const secretKey = "HAfMWKuM";
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = md5(apiKey + secretKey + timestamp);

    // SMS API URL
    const apiUrl = "https://api.onbuka.com/v3/sendSms";

    const params = {
      appId: "31rCEVP5",
      numbers: `91${phone}`,
      content: `Your Order Has been booked ${otp}`,
      senderId: "nayimkhantax",
      orderId: `91${phone}`,
    };

    const headers = {
      "Content-Type": "application/json",
      Sign: signature,
      Timestamp: timestamp,
      "Api-Key": apiKey,
    };

    // Send OTP SMS
    const response = await axios.post(apiUrl, params, { headers });

    return;
  } catch (error) {
    console.error("OTP Send Error:", error?.response?.data || error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
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
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
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
    res
      .status(500)
      .json({ message: "Failed to send email", error: error.message });
  }
};

export const getOrderDetailByID = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!id || id.length !== 24) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID format",
      });
    }

    // Find order
    const order = await Orders.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      data: order,
    });
  } catch (error) {
    console.error("Order fetch error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const utils = {
  generateUniqueNumberCodeByDigit(digit) {
    const timestamp = new Date().getTime().toString();
    const randomNum = _.random(1e12).toString();
    const combined = timestamp + randomNum;
    return _.padStart(combined.slice(-digit), digit, "0");
  },
  getIpAddress(req) {
    let ipAddress =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    if (ipAddress.substr(0, 7) == "::ffff:") {
      ipAddress = ipAddress.substr(7);
    }
    return ipAddress;
  },
};

export const sendOtpPhone = async (req, res) => {
  console.log("caled ");
  try {
    // Validate phone
    const schema = Joi.object({
      phone: Joi.string().length(10).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
      });
    }

    const { phone } = req.body;
    console.log("phone is ", phone);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    const now = Date.now();
    const timeEnd = moment().add(1, "minute").valueOf();

    // Signature
    const apiKey = "yFflv72N";
    const secretKey = "HAfMWKuM";
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = md5(apiKey + secretKey + timestamp);

    // SMS API URL
    const apiUrl = "https://api.onbuka.com/v3/sendSms";

    const params = {
      appId: "31rCEVP5",
      numbers: `91${phone}`,
      content: `Your OTP for verification is ${otp}`,
      senderId: "nayimkhantax",
      orderId: `91${phone}`,
    };

    const headers = {
      "Content-Type": "application/json",
      Sign: signature,
      Timestamp: timestamp,
      "Api-Key": apiKey,
    };

    // Send OTP SMS
    const response = await axios.post(apiUrl, params, { headers });

    if (response?.data?.status === "0") {
      return res.status(200).json({
        status: true,
        message: "OTP sent via SMS successfully",
        otp, // remove later
        timeStamp: now,
        timeEnd,
      });
    }

    return res.status(400).json({
      status: false,
      message: "SMS API failed",
      api: response.data,
    });
  } catch (error) {
    console.error("OTP Send Error:", error?.response?.data || error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};
