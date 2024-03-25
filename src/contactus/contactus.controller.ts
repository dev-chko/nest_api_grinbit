import { Body, Controller, Post, Res, HttpStatus } from '@nestjs/common';
import { Public } from 'src/auth/skipAuth.decorator';
import { EmailService } from 'src/email/email.service';

@Controller('contactus')
export class ContactusController {
  constructor(private readonly emailService: EmailService) {}

  @Public()
  @Post('/email')
  async ContactUs(@Body() body, @Res() response) {
    const { email, content, mobile, cops } = body;
    const sendReply = await this.emailService.reply(email, cops);
    const sendSave = await this.emailService.saveContact(
      email,
      cops,
      content,
      mobile,
    );
    if (sendReply && sendSave) {
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        message: 'Contact us Mail Send OK',
        data: sendReply,
      });
    } else {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Contact Us Error',
        data: false,
      });
    }
  }
}
