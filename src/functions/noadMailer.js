import NodeMailer from 'nodemailer'



export const transporter = NodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.ADMIN_MAIL_ADDRESS,
      pass: process.env.ADMIN_MAIL_PASSWORD,
    },
  });



  export function createMail(name, email, subject, message, to) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to, 
        subject: subject,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
      };

      return mailOptions

  }

