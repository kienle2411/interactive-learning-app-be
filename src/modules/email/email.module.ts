import { Global, Module } from '@nestjs/common';
import { MailgunModule, MailgunService } from 'nestjs-mailgun';
import { EmailService } from './email.service';
import { JwtService } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    MailgunModule.forAsyncRoot({
      useFactory: async () => {
        return {
          username: 'api',
          key: process.env.MAILGUN_API_KEY,
          url: process.env.MAILGUN_HOST,
        };
      },
    }),
  ],
  providers: [EmailService, JwtService],
  exports: [EmailService, MailgunModule],
  controllers: [],
})
export class EmailModule {}
