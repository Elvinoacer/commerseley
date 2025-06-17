import { allLinks } from "../lib/custom-ntf";

export function deletedProducts() {
  return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notice: Products Discontinued</title>
    <style type="text/css">
        /* Base styles */
        body, html {
            margin: 0;
            padding: 0;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f7f7f7;
        }

        /* Email container */
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        /* Header */
        .header {
            background: linear-gradient(135deg, #6e8efb, #a777e3);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }

        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 300;
        }

        /* Content */
        .content {
            padding: 30px;
        }

        /* Update card */
        .update-card {
            background: #f9f9f9;
            border-left: 4px solid #6e8efb;
            padding: 20px;
            margin-bottom: 25px;
            border-radius: 0 4px 4px 0;
        }

        .update-title {
            color: #444;
            font-size: 20px;
            margin-top: 0;
            margin-bottom: 15px;
        }

        .update-message {
            color: #666;
            margin-bottom: 15px;
        }

        .impact-list {
            padding-left: 20px;
            color: #666;
        }

        .impact-list li {
            margin-bottom: 8px;
        }

        /* Action section */
        .action-section {
            background: #f0f4ff;
            padding: 20px;
            border-radius: 4px;
            margin: 25px 0;
        }

        .action-title {
            color: #444;
            font-size: 18px;
            margin-top: 0;
            margin-bottom: 15px;
        }

        /* Button */
        .cta-button {
            display: inline-block;
            background: #6e8efb;
            color: white;
            text-decoration: none;
            padding: 12px 30px;
            border-radius: 30px;
            font-weight: 600;
            font-size: 16px;
            transition: background 0.3s ease;
            margin-top: 15px;
        }

        .cta-button:hover {
            background: #5a7df0;
        }

        /* Footer */
        .footer {
            background: #f5f5f5;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #999;
        }

        .social-icons {
            margin: 15px 0;
        }

        .social-icons a {
            display: inline-block;
            margin: 0 5px;
            color: #777;
            text-decoration: none;
            font-size: 16px;
        }

        /* Responsive adjustments */
        @media only screen and (max-width: 480px) {
            .header h1 {
                font-size: 24px;
            }
            
            .content {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Product Update Notice</h1>
        </div>

        <div class="content">
            <p>Dear Valued Customer,</p>
            
            <p>We’re reaching out to share an important update about our product offerings.</p>
            
            <div class="update-card">
                <h2 class="update-title">Products Discontinued</h2>
                <p class="update-message">We have discontinued certain products from our store as part of our efforts to refine our collection and bring you the best possible shopping experience.</p>
                
                <p class="update-message">What this means for you:</p>
                <ul class="impact-list">
                    <li>Discontinued products are no longer available for purchase.</li>
                    <li>Your saved preferences or wishlist items related to these products have been updated.</li>
                    <li>We have a wide range of alternative products you might love!</li>
                </ul>
            </div>

            <div class="action-section">
                <h3 class="action-title">Explore Our Current Collection</h3>
                <p>We invite you to discover our latest products and find new favorites:</p>
                <ul class="impact-list">
                    <li>Browse our updated product listings to see what’s new.</li>
                    <li>Check out similar items in related categories.</li>
                    <li>Contact our support team if you need help finding alternatives.</li>
                </ul>
                
                <a href="${allLinks.pageLinks.allProducts}" class="cta-button">Shop Now</a>
            </div>

            <p>Thank you for your understanding as we continue to enhance our store. If you have any questions or need assistance, please reach out to our support team.</p>
            
            <p>Best regards,<br>The Commersely Team</p>
        </div>

        <div class="footer">
            <div class="social-icons">
                <a href="${allLinks.socialLinks.facebook}">Facebook</a> • <a href="${allLinks.socialLinks.twitter}">Twitter</a> • <a href="${allLinks.socialLinks.instagram}">Instagram</a>
            </div>
            <p>© 2025 Commersely. All rights reserved.</p>
            <p>
                <a href="${allLinks.pageLinks.unsubsribe}" style="color: #777">Unsubscribe</a> |
                <a href="${allLinks.pageLinks.privacy}" style="color: #777">Privacy Policy</a> |
                <a href="#" style="color: #777">Contact Us</a>
            </p>
            <p>123 Business Street, City, State 12345</p>
        </div>
    </div>
</body>
</html>
    `;
}
