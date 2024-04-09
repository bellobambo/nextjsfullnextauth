import Handlebars from 'handlebars';
import nodemailer from 'nodemailer';
import { activationTemplate } from './emailTemplates/activation';

export async function sendMail({
    to,
    subject,
    body,
}: {
    to: string;
    subject: string;
    body: string;
}) {
    const { SMTP_EMAIL, SMTP_GMAIL_PASS, SMTP_USER, SMTP_PASS } = process.env;
    //
    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
        },
    });

    try {
        const testResult = await transport.verify();
        console.log("Test Result Of Transport", testResult);
    } catch (e) {
        console.log(e);
    }
    try {
        const sendResult = await transport.sendMail({
            from: SMTP_EMAIL,
            to,
            subject,
            html: body,
        });
        console.log({ sendResult });
        return sendResult;
    } catch (e) {
        console.log(e);
    }
}

export function compileActivationTemplate(name: string, url: string) {
    const template = Handlebars.compile(activationTemplate);
    const htmlBody = template({
        name,
        url,
    });
    return htmlBody;
}
