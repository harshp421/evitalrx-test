import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path'
import dotenv from 'dotenv';
dotenv.config();


import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sendMail=async(options)=>{
   const transporter =nodemailer.createTransport({
    host: process.env.SMTP_HOST,
        port:parseInt(process.env.SMTP_PORT || "587"),
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
   })

   const data = {
    from:process.env.SMTP_EMAIL,
    to: options.email,
    subject: options.subject,
    html: await ejs.renderFile(path.join(__dirname, `../mails/${options.template}`), options.data)
}
await transporter.sendMail(data);
}
export default sendMail;