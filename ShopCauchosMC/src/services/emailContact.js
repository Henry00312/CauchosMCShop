import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const { GMAIL_USER, GMAIL_PASS } = process.env;
//App Passwords (si tienes 2FA activado)

async function createTransport() {
  if (!GMAIL_USER || !GMAIL_PASS) {
    throw new Error(
      "Faltan credenciales Gmail en variables de entorno (GMAIL_USER, GMAIL_PASS)"
    );
  }
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: GMAIL_USER, pass: GMAIL_PASS },
  });
}

export async function sendContactEmail(message) {
  const transporter = await createTransport();
  const info = await transporter.sendMail({
    from: `CauchosMC Web <${GMAIL_USER}>`,
    to: "cauchosmc@gmail.com",
    subject: "Pagina Web",
    text: `${message}`,
  });
  return {
    messageId: info.messageId,
    accepted: info.accepted,
    rejected: info.rejected,
  };
}
