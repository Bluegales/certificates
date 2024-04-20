import * as mail from "mailersend";
import {env} from "./server"

export function sendEmail(email: string, code: number) {
    const mailersend = new mail.MailerSend({
        apiKey: env.MAILERSEND_API_KEY,
    });

    const recipients = [new mail.Recipient(email, "Recipient")];
    const sender = new mail.Sender("certificate@trial-0p7kx4xqp3vg9yjr.mlsender.net", "Vitalik Buterin")

    const emailParams: mail.EmailParams = new mail.EmailParams()
        .setFrom(sender)
        .setTo(recipients)
        .setSubject("certificate login code")
        .setText(`This is your login code: ${code}`);

    mailersend.email
        .send(emailParams)
        .then((response) => console.log(response))
        .catch((error) => console.log(error));
}
