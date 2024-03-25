import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async _send(
    tos: string[],
    subject: string,
    templateName: string,
    context: any = {},
  ): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: tos.join(', '),
        subject,
        template: `./${templateName}`,
        context,
      });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async reply(to: string, cops: string) {
    try {
      return await this._send([to], `입점문의_${cops}`, 'emailReply.ejs', {
        cops: cops,
      });
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async saveContact(to: string, cops: string, content: string, mobile: number) {
    try {
      return await this._send(
        ['info@grinbit.io'],
        `입점문의_${to}`,
        'emailContact.ejs',
        {
          email: to,
          cops: cops,
          context: content,
          mobile: mobile,
        },
      );
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
