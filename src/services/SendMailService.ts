import nodemailer, { Transporter } from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';

interface IMailProps {
  name: string;
  title: string;
  description: string;
  id: string;
  link: string;
}

class SendMailService {
  private client: Transporter;

  constructor() {
    nodemailer.createTestAccount().then(account => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass
        }
      })

      this.client = transporter;
    })

  }

  async execute(to: string, subject: string, mailProps: IMailProps, path: string) {

    const templateFileContent = fs.readFileSync(path).toString("utf-8");

    const mailTemplateParse = handlebars.compile(templateFileContent);

    const html = mailTemplateParse(mailProps)

    const message = await this.client.sendMail({
      from: "NPS <noreplay@nps.com.br>",
      to,
      subject,
      html,
    })

    console.log('Massage sent: %s', message.messageId);
    console.log('Preview URL %s', nodemailer.getTestMessageUrl(message));
  }
}

export default new SendMailService;