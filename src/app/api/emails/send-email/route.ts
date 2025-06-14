import { NextRequest, NextResponse } from "next/server";
import { transporter } from "@/services/emails";
import { emailTemplate } from "@/templates/email";
import { autoReply, defaultAutoReplyParam } from "../utils";

export async function POST(req: NextRequest) {
  try {
    const { name, email, title, message, ...otherFields } = await req.json();

    if (!name || !email || !title || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: name, email, title, and message are required",
        },
        { status: 400 }
      );
    }

    const mailOptions = {
      from: email,
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Form Submission: ${title}`,
      html: emailTemplate({ name, email, title, message, otherFields }),
    };

    await Promise.all([
      transporter.sendMail(mailOptions),
      autoReply({ ...defaultAutoReplyParam, email, senderName: name }),
    ]);

    return NextResponse.json({ success: true, message: "Email sent successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send email",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
