import { transporter } from "@/services/emails";
import { autoReplyTemplate } from "@/templates/email";

export const defaultAutoReplyParam = {
  subject: "Thanks for signup",
  message: "We have realized you have signup with us, \n welcome onboard as we start our mistery journey",
  replyTimeframe: new Date(Date.now()).toDateString(),
  emergencyContact: "0790670542",
  companyName: "Commersely",
  additionalInfo: "Better we get you started soon",
};

export async function autoReply({
  senderName,
  subject,
  message,
  email,
  replyTimeframe,
  emergencyContact,
  companyName,
  additionalInfo,
}: {
  senderName: string;
  email?: string;
  subject: string;
  message: string;
  replyTimeframe: string;
  emergencyContact?: string;
  companyName: string;
  additionalInfo?: string;
}) {
  try {
    if (!senderName || !email || !subject || !replyTimeframe || !emergencyContact || !companyName || !additionalInfo) {
      console.log("missing some fields");
      throw new Error("Missing some fields");
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `${subject}`,
      html: autoReplyTemplate({
        senderName,
        subject,
        message,
        replyTimeframe,
        emergencyContact,
        companyName,
        additionalInfo,
      }),
    };

    await transporter.sendMail(mailOptions);

    console.log("successfully sent the auto-response");
  } catch (error: any) {
    console.error("Error sending email:", error);
    throw error;
  }
}
