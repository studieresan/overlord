import * as dotenv from 'dotenv';
dotenv.config({ path: '../.env' })

import { SendEmail, Email } from "./SendEmail";


export class SendEmailImpl implements SendEmail {
    sendEmail({
        to,
        from,
        subject,
        body,
    }: Email): Promise<void> {
        if (process.env.DEV === 'true') {
            console.log(`Sending email to ${to} with subject ${subject} and body ${body}`)
            return Promise.resolve();
        }
        console.log("sending email to spam", process.env.SPAM_URL, process.env.SPAM_KEY)
        return fetch(process.env.SPAM_URL!, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                key: process.env.SPAM_KEY,
                from: 'no-reply@datasektionen.se',
                to: to,
                replyTo: from,
                subject: subject,
                html: body,
            }),
        })
        .then(res => {
            if (!res.ok) {
                throw new Error(`Failed to send email: ${res.statusText}`)
            }
            return Promise.resolve();
        })
        .catch(err => {
            console.error(`Failed to send email: ${err}`)
            return Promise.reject(err);
        })
    }
}