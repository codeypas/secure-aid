import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
import { Worker } from "bullmq";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const worker = new Worker(
  "email-sender-queue",
  async (job) => {
    const { emailId, subject, body } = job.data;

    try {
      const info = await transporter.sendMail({
        from: '"Your Name" <your-email@gmail.com>',
        to: emailId,
        subject: subject || "No Subject",
        html: body || "<p>No content</p>",
      });

      console.log(`Email sent to ${ emailId }: ${ info.messageId }`);
    } catch (error) {
      console.error(`Failed to send email to ${ emailId }:`, error);
    }
  },
  {
    concurrency: 100,
    connection: {
      host: "localhost",
      port: 6379,
    },
  }
);