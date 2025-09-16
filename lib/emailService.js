import nodemailer from "nodemailer";

const createTransporter = async () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Email configuration missing: EMAIL_USER and EMAIL_PASS are required");
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      pool: true,
      maxConnections: 1,
      rateDelta: 20000,
      rateLimit: 5,
    });

    await transporter.verify();
    return transporter;
  } catch (error) {
    console.error("Email transporter creation failed:", error);
    throw new Error(`Email configuration error: ${error.message}`);
  }
};

const generateInvitationEmailTemplate = (inviterName, organizationName, invitationToken, employeeName, logoUrl) => {
  const invitationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/accept-invitation?token=${invitationToken}`;
  const defaultLogo = `${process.env.NEXT_PUBLIC_BASE_URL}/favicon.ico`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invitation to Join ${organizationName}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
        .button:hover { background: #5a6fd8; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .highlight { background: #e3f2fd; padding: 15px; border-left: 4px solid #2196f3; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${logoUrl || defaultLogo}" alt="${organizationName} Logo" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          </div>
          <h1>🎉 You're Invited!</h1>
          <p>Join ${organizationName} as a team member</p>
        </div>
        <div class="content">
          <h2>Hello ${employeeName}!</h2>
          <p>Great news! <strong>${inviterName}</strong> has invited you to join <strong>${organizationName}</strong> as a team member.</p>
          
          <div class="highlight">
            <h3>What happens next?</h3>
            <ul>
              <li>Click the invitation link below to accept</li>
              <li>Create your account or sign in if you already have one</li>
              <li>Complete your profile setup</li>
              <li>Start collaborating with your new team!</li>
            </ul>
          </div>
          
          <div style="text-align: center;">
            <a href="${invitationUrl}" class="button" style="color: #ffffff; text-decoration: none;">Accept Invitation</a>
          </div>
          
          <p><strong>Important:</strong> This invitation will expire in 7 days. If you have any questions, please contact ${inviterName} or your HR department.</p>
          
          <p>We're excited to have you join the team!</p>
          
          <p>Best regards,<br>
          The ${organizationName} Team</p>
        </div>
        <div class="footer">
          <p>This invitation was sent to ${employeeName}.</p>
          <p>If you didn't expect this invitation, you can safely ignore this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const sendInvitationEmail = async (invitationData) => {
  try {
    const { email, name, inviterName, organizationName, invitationToken, logoUrl } = invitationData;

    if (!isEmailConfigured()) {
      const invitationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/accept-invitation?token=${invitationToken}`;
      throw new Error(`Email not configured. Share this invitation link manually: ${invitationUrl}`);
    }

    const transporter = await createTransporter();

    const mailOptions = {
      from: {
        name: `${organizationName} - ReeOrg`,
        address: process.env.EMAIL_USER,
      },
      to: email,
      subject: `Invitation to join ${organizationName}`,
      html: generateInvitationEmailTemplate(inviterName, organizationName, invitationToken, name, logoUrl),
      text: `Hello ${name}!\n\n${inviterName} has invited you to join ${organizationName}.\n\nAccept your invitation: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/accept-invitation?token=${invitationToken}\n\nThis invitation expires in 7 days.\n\nBest regards,\nThe ${organizationName} Team`,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Invitation email sent successfully:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending invitation email:", error);

    if (error.message.includes("Email not configured") || error.message.includes("Email configuration missing")) {
      throw error;
    }

    const invitationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/accept-invitation?token=${invitationData.invitationToken}`;
    throw new Error(`Email sending failed: ${error.message}. Manual invitation link: ${invitationUrl}`);
  }
};

export const sendInvitationReminder = async (invitationData) => {
  try {
    const { email, name, inviterName, organizationName, invitationToken } = invitationData;
    
    const transporter = await createTransporter();
    const invitationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/accept-invitation?token=${invitationToken}`;
    
    const mailOptions = {
      from: {
        name: `${organizationName} - ReeOrg`,
        address: process.env.EMAIL_USER,
      },
      to: email,
      subject: `Reminder: Invitation to join ${organizationName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Reminder: You're invited to join ${organizationName}!</h2>
          <p>Hello ${name},</p>
          <p>This is a friendly reminder that ${inviterName} has invited you to join ${organizationName}.</p>
          <p>Your invitation is still pending and will expire soon.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${invitationUrl}" style="background: #667eea; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Accept Invitation</a>
          </div>
          <p>If you have any questions, please contact ${inviterName}.</p>
          <p>Best regards,<br>The ${organizationName} Team</p>
        </div>
      `,
      text: `Reminder: ${inviterName} has invited you to join ${organizationName}.\n\nAccept your invitation: ${invitationUrl}\n\nBest regards,\nThe ${organizationName} Team`,
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log("Reminder email sent successfully:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending reminder email:", error);
    throw new Error(`Failed to send reminder email: ${error.message}`);
  }
};

export const validateEmailConfig = () => {
  const requiredEnvVars = ['EMAIL_USER', 'EMAIL_PASS', 'NEXT_PUBLIC_BASE_URL'];
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return true;
};

export const isEmailConfigured = () => {
  try {
    validateEmailConfig();
    return true;
  } catch (error) {
    return false;
  }
};
