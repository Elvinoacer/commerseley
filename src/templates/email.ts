export function emailTemplate({ name, email, title, message, otherFields }: any) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission</title>
        <style type="text/css">
            /* Client-specific styles */
            body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
            table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
            img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
            
            /* Reset styles */
            body { margin: 0 !important; padding: 0 !important; width: 100% !important; }
            
            /* Main styles */
            body {
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                background-color: #f8f9fa;
                color: #333333;
                line-height: 1.4;
            }
            
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            
            .card {
                background: #ffffff;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            
            .header {
                background: #6e8efb;
                background: linear-gradient(to right, #6e8efb, #a777e3);
                color: white;
                padding: 25px 30px;
                text-align: center;
            }
            
            .header h2 {
                margin: 0;
                font-weight: 600;
                font-size: 22px;
            }
            
            .content {
                padding: 25px 30px;
            }
            
            .field-group {
                margin-bottom: 18px;
            }
            
            .field-group strong {
                display: block;
                color: #6e8efb;
                font-weight: 500;
                margin-bottom: 5px;
                font-size: 14px;
            }
            
            .field-group p {
                margin: 0;
                padding: 10px 15px;
                background: #f8f9fa;
                border-radius: 6px;
                border-left: 3px solid #a777e3;
            }
            
            .additional-info {
                margin-top: 25px;
                padding-top: 20px;
                border-top: 1px dashed #e0e0e0;
            }
            
            .additional-info h3 {
                color: #6e8efb;
                font-size: 16px;
                margin-top: 0;
                margin-bottom: 15px;
            }
            
            .footer {
                text-align: center;
                margin-top: 25px;
                font-size: 12px;
                color: #999999;
            }
            
            .highlight {
                color: #6e8efb;
                font-weight: 600;
            }
            
            /* Responsive styles */
            @media screen and (max-width: 600px) {
                .container {
                    width: 100% !important;
                }
                .card {
                    border-radius: 0 !important;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="card">
                <div class="header">
                    <h2>New Contact Form Submission</h2>
                </div>
                
                <div class="content">
                    <div class="field-group">
                        <strong>Name</strong>
                        <p>${name}</p>
                    </div>
                    
                    <div class="field-group">
                        <strong>Email</strong>
                        <p>${email}</p>
                    </div>
                    
                    <div class="field-group">
                        <strong>Title</strong>
                        <p>${title}</p>
                    </div>
                    
                    <div class="field-group">
                        <strong>Message</strong>
                        <p>${message}</p>
                    </div>
                    
                    ${
                      Object.keys(otherFields).length > 0
                        ? `
                    <div class="additional-info">
                        <h3>Additional Information</h3>
                        ${Object.entries(otherFields)
                          .map(
                            ([key, value]) => `
                            <div class="field-group">
                                <strong>${key}</strong>
                                <p>${value}</p>
                            </div>
                        `
                          )
                          .join("")}
                    </div>
                    `
                        : ""
                    }
                </div>
            </div>
            
            <div class="footer">
                <p>This message was sent from your website's contact form. <span class="highlight">Please respond within 24 hours.</span></p>
            </div>
        </div>
    </body>
    </html>
    `;
}

export function activityNotificationTemplate({
  userName,
  notificationTitle,
  notificationMessage,
  activities,
  ctaLink,
  ctaText,
}: {
  userName: string;
  notificationTitle: string;
  notificationMessage: string;
  activities: Array<{
    title: string;
    description: string;
    time: string;
    icon?: string;
  }>;
  ctaLink?: string;
  ctaText?: string;
}) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${notificationTitle}</title>
    <style type="text/css">
        /* Client-specific resets */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        
        /* Base styles */
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #f7fafc;
            color: #4a5568;
            margin: 0;
            padding: 0;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            padding: 25px 0;
            text-align: center;
            background-color: #ffffff;
        }
        
        .logo {
            color: #4299e1;
            font-size: 24px;
            font-weight: bold;
            text-decoration: none;
        }
        
        .content-card {
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            overflow: hidden;
            margin-bottom: 20px;
        }
        
        .greeting {
            padding: 25px 30px 10px;
            font-size: 18px;
            color: #2d3748;
        }
        
        .notification-title {
            padding: 0 30px 15px;
            font-size: 22px;
            font-weight: bold;
            color: #2d3748;
        }
        
        .notification-message {
            padding: 0 30px 25px;
            font-size: 15px;
            line-height: 1.6;
            color: #4a5568;
        }
        
        .activity-item {
            padding: 20px 30px;
            border-top: 1px solid #edf2f7;
            display: flex;
        }
        
        .activity-icon {
            width: 40px;
            height: 40px;
            background-color: #ebf8ff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            color: #3182ce;
            font-size: 18px;
        }
        
        .activity-content {
            flex: 1;
        }
        
        .activity-title {
            font-weight: bold;
            color: #2d3748;
            margin-bottom: 5px;
        }
        
        .activity-description {
            font-size: 14px;
            color: #718096;
            line-height: 1.5;
            margin-bottom: 5px;
        }
        
        .activity-time {
            font-size: 12px;
            color: #a0aec0;
        }
        
        .cta-container {
            padding: 25px 30px;
            text-align: center;
        }
        
        .cta-button {
            display: inline-block;
            background-color: #4299e1;
            color: #ffffff;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: bold;
            font-size: 15px;
        }
        
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #a0aec0;
        }
        
        /* Responsive styles */
        @media screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
                padding: 10px !important;
            }
            .greeting, .notification-title, .notification-message, .activity-item {
                padding-left: 20px !important;
                padding-right: 20px !important;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <a href="#" class="logo">YourApp</a>
        </div>
        
        <div class="content-card">
            <div class="greeting">
                Hi ${userName},
            </div>
            
            <div class="notification-title">
                ${notificationTitle}
            </div>
            
            <div class="notification-message">
                ${notificationMessage}
            </div>
            
            ${activities
              .map(
                (activity) => `
            <div class="activity-item">
                <div class="activity-icon">
                    ${activity.icon || "⚡"}
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-description">${activity.description}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            </div>
            `
              )
              .join("")}
            
            ${
              ctaLink && ctaText
                ? `
            <div class="cta-container">
                <a href="${ctaLink}" class="cta-button">${ctaText}</a>
            </div>
            `
                : ""
            }
        </div>
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} YourApp. All rights reserved.</p>
            <p>If you didn't request these notifications, please <a href="#" style="color: #a0aec0;">unsubscribe</a>.</p>
        </div>
    </div>
</body>
</html>
`;
}

// export function autoReplyTemplate({
//   senderName,
//   subject,
//   message,
//   replyTimeframe,
//   emergencyContact,
//   companyName,
//   additionalInfo,
// }: {
//   senderName: string;
//   subject: string;
//   message: string;
//   replyTimeframe: string;
//   emergencyContact?: string;
//   companyName: string;
//   additionalInfo?: string;
// }) {
//   return `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>${subject}</title>
//     <style type="text/css">
//         /* Client-specific resets */
//         body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
//         table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
//         img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }

//         /* Base styles */
//         body {
//             font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
//             background-color: #f7fafc;
//             color: #4a5568;
//             margin: 0;
//             padding: 0;
//             line-height: 1.6;
//         }

//         .email-container {
//             max-width: 600px;
//             margin: 0 auto;
//             padding: 20px;
//         }

//         .header {
//             padding: 25px 0;
//             text-align: center;
//             background-color: #ffffff;
//         }

//         .logo {
//             color: #4299e1;
//             font-size: 24px;
//             font-weight: bold;
//             text-decoration: none;
//         }

//         .content-card {
//             background-color: #ffffff;
//             border-radius: 8px;
//             box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
//             overflow: hidden;
//             margin-bottom: 20px;
//         }

//         .content {
//             padding: 30px;
//         }

//         .greeting {
//             font-size: 18px;
//             color: #2d3748;
//             margin-bottom: 20px;
//         }

//         .message {
//             font-size: 15px;
//             color: #4a5568;
//             margin-bottom: 25px;
//         }

//         .highlight-box {
//             background-color: #ebf8ff;
//             border-left: 4px solid #4299e1;
//             padding: 15px;
//             margin: 20px 0;
//             border-radius: 0 4px 4px 0;
//         }

//         .highlight-title {
//             font-weight: bold;
//             color: #2d3748;
//             margin-bottom: 8px;
//         }

//         .contact-info {
//             margin-top: 25px;
//             padding-top: 20px;
//             border-top: 1px solid #edf2f7;
//         }

//         .footer {
//             text-align: center;
//             padding: 20px;
//             font-size: 12px;
//             color: #a0aec0;
//         }

//         /* Responsive styles */
//         @media screen and (max-width: 600px) {
//             .email-container {
//                 width: 100% !important;
//                 padding: 10px !important;
//             }
//             .content {
//                 padding: 20px !important;
//             }
//         }
//     </style>
// </head>
// <body>
//     <div class="email-container">
//         <div class="header">
//             <a href="#" class="logo">${companyName}</a>
//         </div>

//         <div class="content-card">
//             <div class="content">
//                 <div class="greeting">
//                     Hi ${senderName},
//                 </div>

//                 <div class="message">
//                     ${message}
//                 </div>

//                 <div class="highlight-box">
//                     <div class="highlight-title">⏰ Expected Response Time</div>
//                     <div>I'll get back to you within ${replyTimeframe}.</div>
//                 </div>

//                 ${
//                   emergencyContact
//                     ? `
//                 <div class="highlight-box">
//                     <div class="highlight-title">🚨 Urgent Matters</div>
//                     <div>For immediate assistance, please contact ${emergencyContact}.</div>
//                 </div>
//                 `
//                     : ""
//                 }

//                 ${
//                   additionalInfo
//                     ? `
//                 <div class="message">
//                     ${additionalInfo}
//                 </div>
//                 `
//                     : ""
//                 }

//                 <div class="contact-info">
//                     <p>Best regards,<br>The ${companyName} Team</p>
//                 </div>
//             </div>
//         </div>

//         <div class="footer">
//             <p>This is an automated message. Please do not reply directly to this email.</p>
//             <p>© ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
//         </div>
//     </div>
// </body>
// </html>
// `;
// }

export function autoReplyTemplate({
  senderName,
  subject,
  message,
  replyTimeframe,
  emergencyContact,
  companyName,
  additionalInfo,
}: {
  senderName: string;
  subject: string;
  message: string;
  replyTimeframe: string;
  emergencyContact?: string;
  companyName: string;
  additionalInfo?: string;
}) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Thank You for Contacting ${companyName}</title>
    <style type="text/css">
        /* Reset styles for email clients */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        body {
            margin: 0;
            padding: 0;
            width: 100% !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f4f7fa;
            color: #333333;
            line-height: 1.6;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #4c6ef5, #7b3fe4);
            padding: 30px;
            text-align: center;
            color: #ffffff;
        }
        .header h1 {
            font-size: 24px;
            margin: 0;
            font-weight: 600;
        }
        .content {
            padding: 30px;
        }
        .greeting {
            font-size: 18px;
            font-weight: 500;
            color: #1f2937;
            margin-bottom: 15px;
        }
        .message {
            font-size: 16px;
            color: #4b5563;
            margin-bottom: 20px;
        }
        .callout {
            background-color: #f0f9ff;
            border-left: 4px solid #3b82f6;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .callout-title {
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 5px;
        }
        .callout-text {
            font-size: 14px;
            color: #4b5563;
        }
        .signature {
            margin-top: 25px;
            font-size: 14px;
            color: #4b5563;
        }
        .footer {
            background-color: #f4f7fa;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
        }
        .footer a {
            color: #3b82f6;
            text-decoration: none;
        }
        /* Responsive styles */
        @media screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
                margin: 0 !important;
                border-radius: 0;
            }
            .header, .content {
                padding: 20px !important;
            }
            .header h1 {
                font-size: 20px;
            }
            .greeting, .message {
                font-size: 14px !important;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Thank You for Reaching Out!</h1>
        </div>
        <div class="content">
            <div class="greeting">
                Dear ${senderName},
            </div>
            <div class="message">
                Thank you for contacting ${companyName}. We’ve received your message regarding "${subject}" and truly appreciate you taking the time to reach out. Whether you have a question, an issue, or just want to share feedback, we’re here to help.
            </div>
            <div class="message">
                Our team is already reviewing your inquiry, and we’ll get back to you within ${replyTimeframe} with a personalized response. In the meantime, feel free to check out our resources or reach out again if you have additional details to share.
            </div>
            <div class="callout">
                <div class="callout-title">What to Expect Next</div>
                <div class="callout-text">
                    You’ll hear from us soon—within ${replyTimeframe}. If you need immediate assistance, see our contact options below.
                </div>
            </div>
            ${
              emergencyContact
                ? `
            <div class="callout">
                <div class="callout-title">Need Help Right Away?</div>
                <div class="callout-text">
                    For urgent matters, please reach us at ${emergencyContact}.
                </div>
            </div>
            `
                : ""
            }
            ${
              additionalInfo
                ? `
            <div class="message">
                <strong>Additional Information:</strong><br>
                ${additionalInfo}
            </div>
            `
                : ""
            }
            <div class="signature">
                Warm regards,<br>
                The ${companyName} Support Team
            </div>
        </div>
        <div class="footer">
            <p>This is an automated reply. Please do not respond directly to this email.</p>
            <p>© ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
            <p><a href="#">Privacy Policy</a> | <a href="#">Contact Us</a></p>
        </div>
    </div>
</body>
</html>
`;
}
