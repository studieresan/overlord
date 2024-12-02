export type Email = {
    to: string,
    from: string,
    subject: string,
    body: string
}
export interface SendEmail {
    sendEmail(email: Email): Promise<void>
}