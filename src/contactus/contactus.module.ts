import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { ContactusController } from './contactus.controller';
import { ContactusService } from './contactus.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    EmailModule,
    MailerModule.forRoot({
      transport: {
        host: 'mail.grinbit.io',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'info@grinbit.io', // generated ethereal user
          pass: 'Grinbit12#$', // generated ethereal password
        },
      },
      defaults: {
        from: '"info@grinbit.io" <info@grinbit.io>', // outgoing email ID
      },
      template: {
        dir: process.cwd() + '/src/templates/',
        adapter: new EjsAdapter(), // or new PugAdapter()
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [ContactusController],
  providers: [ContactusService],
})
export class ContactusModule {}
