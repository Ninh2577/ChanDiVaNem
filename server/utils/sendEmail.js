import nodemailer from 'nodemailer';

export const sendEmail = async ({ email, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
    port: parseInt(process.env.SMTP_PORT) || 2525,
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  });

  const mailOptions = {
    from: `"Chân Đi Và Nếm" <no-reply@chandivanem.com>`,
    to: email,
    subject: subject,
    html: html,
  };

  await transporter.sendMail(mailOptions);
};
