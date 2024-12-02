import { SendEmail, Email } from "./SendEmail";

export class SendEmailImpl implements SendEmail {
    sendEmail({
        to,
        from,
        subject,
        body,
    }: Email): Promise<void> {
        if (process.env.NODE_ENV === 'development') {
            console.log(`Sending email to ${to} with subject ${subject} and body ${body}`)
            return Promise.resolve();
        }
        console.log("sending email to spam")
        return fetch(process.env.SPAM_URL!, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                key: process.env.SPAM_KEY,
                from: from,
                to: to,
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