import { NextRequest, NextResponse } from "next/server";
import { transporter } from "@/services/emails";
import { activityNotificationTemplate } from "@/templates/email";

export async function POST(req: NextRequest) {
  try {
    const { userName, email, notificationTitle, notificationMessage, activities, ctaLink, ctaText } = await req.json();

    if (!userName || !email || !notificationTitle || !notificationMessage || !activities || !ctaLink || !ctaText) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Missing required fields: userName, notificationTitle, notificationMessage, activities, ctaLink, ctaText are required",
        },
        { status: 400 }
      );
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `${notificationTitle}`,
      html: activityNotificationTemplate({
        userName,
        notificationTitle,
        notificationMessage,
        activities,
        ctaLink,
        ctaText,
      }),
    };

    await transporter.sendMail(mailOptions);

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
