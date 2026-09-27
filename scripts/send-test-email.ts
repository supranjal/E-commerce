import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());
import nodemailer from "nodemailer";
import { Resend } from "resend";
import { generateOrderConfirmedEmail } from "../src/lib/email/templates/order-confirmed";

/**
 * Script to test sending a genuine email to your real Gmail address.
 *
 * Usage:
 *   npx tsx scripts/send-test-email.ts yourname@gmail.com
 */
async function main() {
  const targetEmail = process.argv[2] || process.env.TEST_EMAIL_RECIPIENT || process.env.GMAIL_USER;

  console.log("=================================================");
  console.log("✉️  RUDRAKART GENUINE EMAIL DISPATCH TEST");
  console.log("=================================================\n");

  if (!targetEmail || !targetEmail.includes("@")) {
    console.error("❌ Please provide your real email address as an argument, for example:");
    console.error("   npx tsx scripts/send-test-email.ts yourname@gmail.com\n");
    process.exit(1);
  }

  console.log(`🎯 Destination Inbox: ${targetEmail}`);

  // Generate real branded RudraKart email content
  const emailContent = generateOrderConfirmedEmail({
    customerName: "RudraKart Collector",
    orderNumber: "RK-2026-LIVE-" + Math.floor(100000 + Math.random() * 900000),
    orderDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    items: [
      {
        name: "1 Mukhi Savar Rudraksha (Nepal - Authentic Specimen)",
        quantity: 1,
        price: 145000,
      },
    ],
    totalAmount: 145000,
    currency: "NPR",
    paymentMethod: "eSewa Mobile Wallet (Verified)",
    shippingAddress: "Baluwatar, Ward 04",
    city: "Kathmandu",
    country: "Nepal",
    orderStatus: "CONFIRMED",
  });

  const gmailUser = process.env.GMAIL_USER?.trim();
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD?.trim();
  const resendApiKey = process.env.RESEND_API_KEY?.trim();

  // Method 1: Gmail SMTP (Google App Password)
  if (gmailUser && gmailAppPassword) {
    console.log(`\n🚀 Sending via Google Gmail SMTP (${gmailUser})...`);
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: gmailUser,
          pass: gmailAppPassword,
        },
      });

      const info = await transporter.sendMail({
        from: `"RudraKart Nepal" <${gmailUser}>`,
        to: targetEmail,
        subject: `[LIVE TEST] ${emailContent.subject}`,
        html: emailContent.html,
        text: emailContent.text,
      });

      console.log("\n🎉 SUCCESS! Genuine email delivered to your inbox!");
      console.log(`📬 Check inbox: ${targetEmail}`);
      console.log(`🆔 Message ID:  ${info.messageId}\n`);
      return;
    } catch (err: any) {
      console.error("\n❌ Gmail SMTP Error:", err.message);
      console.error("\nTip: Make sure you are using a 16-character Google 'App Password', not your normal login password.");
      console.error("See instructions below.\n");
    }
  }

  // Method 2: Resend API
  if (resendApiKey && resendApiKey.startsWith("re_")) {
    console.log(`\n🚀 Sending via Resend API...`);
    try {
      const resend = new Resend(resendApiKey);
      const emailFrom = process.env.EMAIL_FROM || "onboarding@resend.dev";
      const { data, error } = await resend.emails.send({
        from: emailFrom,
        to: [targetEmail],
        subject: `[LIVE TEST] ${emailContent.subject}`,
        html: emailContent.html,
        text: emailContent.text,
      });

      if (error) {
        console.error("❌ Resend Error:", error.message);
      } else {
        console.log("\n🎉 SUCCESS! Email dispatched via Resend!");
        console.log(`📬 Check inbox: ${targetEmail}`);
        console.log(`🆔 Resend ID:   ${data?.id}\n`);
        return;
      }
    } catch (err: any) {
      console.error("❌ Resend Exception:", err.message);
    }
  }

  // If credentials are not set up yet
  console.log("\n⚠️  NO EMAIL CREDENTIALS CONFIGURED IN .env YET!");
  console.log("\nTo receive genuine emails directly in your Gmail inbox, add these two lines to your .env file:\n");
  console.log(`GMAIL_USER="yourname@gmail.com"`);
  console.log(`GMAIL_APP_PASSWORD="xxxx xxxx xxxx xxxx"`);
  console.log(`TEST_EMAIL_RECIPIENT="${targetEmail}"\n`);
  console.log("---------------------------------------------------------------");
  console.log("HOW TO GET A FREE GOOGLE APP PASSWORD (TAKES 60 SECONDS):");
  console.log("1. Open: https://myaccount.google.com/apppasswords");
  console.log("   (If it asks to turn on 2-Step Verification, enable it under Security).");
  console.log("2. Name the app 'RudraKart' and click 'Create'.");
  console.log("3. Google will give you a 16-letter password (e.g. 'abcd efgh ijkl mnop').");
  console.log("4. Paste it into your .env file as GMAIL_APP_PASSWORD.");
  console.log("---------------------------------------------------------------\n");
}

main().catch(console.error);
