import eventEmitter from "./eventEmitter";
import nodemailer from 'nodemailer';

export default (): void => {
    eventEmitter.on('send_email', (emailData: object) => {
        async function main(){
            const transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: Number(process.env.EMAIL_PORT),
                secure: false, 
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD,
                },
            })
            const response = await transporter.sendMail({
                from: process.env.EMAIL_FROM,
                ...emailData
            })
        }
        main().catch(console.error);
    })
}