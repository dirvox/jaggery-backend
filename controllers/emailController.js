// controllers/emailController.js
import nodemailer from "nodemailer";
import { validateAndCleanEmails } from "../utils/emailHelpers.js";
import { buildHtmlTemplate } from "../utils/emailTemplates.js";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const sendEmailsHandler = async (req, res) => {
  console.log("email conroller called ");
  try {
    const { recipientList, subject, message, senderName } = req.body;
    if (!recipientList || !subject || !message) {
      return res
        .status(400)
        .json({ message: "recipientList, subject and message are required." });
    }

    // 1. Clean and validate emails
    const emails = validateAndCleanEmails(recipientList);
    if (emails.length === 0) {
      return res
        .status(400)
        .json({ message: "No valid recipient emails found." });
    }

    // 2. create transporter (use environment variables)
    // const transporter = nodemailer.createTransport({
    //   host: process.env.SMTP_HOST || "smtp.gmail.com",
    //   port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465,
    //   secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : true,
    //   auth: {
    //     user: process.env.SMTP_USER,
    //     pass: process.env.SMTP_PASS,
    //   },
    //   // optional pool settings for many emails:
    //   pool: false, // sequential sending below, set true and tune for large volume
    //   // logger: true,
    // });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "devanshjinraniya41@gmail.com",
        pass: "mtonrhqeigxyrjto", // Use app password for Gmail
      },
    });

    // verify connection config
    await transporter.verify();

    // 3. send one-by-one
    const results = [];
    const htmlTemplate = buildHtmlTemplate({
      websiteUrl: process.env.WEBSITE_URL || "https://khatauligud.com/",
      message,
      senderName: senderName || "Technical Hub by DV",
    });

    for (let i = 0; i < emails.length; i++) {
      const to = emails[i];
       console.log("tp " , to)
      const mailOptions = {
        from: `"${process.env.FROM_NAME || "Khatauli Gud"}" <${
          process.env.SMTP_USER
        }>`,
        to,
        subject,
        text: message, // plain text fallback
        html: htmlTemplate,
        headers: {
          // include list-unsubscribe if you host an unsubscribe page
          "List-Unsubscribe": `<${
            process.env.WEBSITE_URL || "https://khatauligud.com"
          }/unsubscribe>`,
        },
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        results.push({ to, success: true, info: info.messageId });
      } catch (err) {
        // log specific failure for each recipient
        console.error(`Failed to send to ${to}:`, err.message || err);
        results.push({ to, success: false, error: err.message || err });
      }

      // small delay to avoid being flagged for bulk sending (tune as needed)
      await sleep(
        process.env.SEND_DELAY_MS ? Number(process.env.SEND_DELAY_MS) : 900
      );
    }

    res.status(200).json({ message: "Processing finished", summary: results });
  } catch (error) {
    console.error("sendEmailsHandler error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
