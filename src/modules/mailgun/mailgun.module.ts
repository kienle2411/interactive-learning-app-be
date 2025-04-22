import { Module } from '@nestjs/common';
import { MailgunModule as Mailgun } from 'nestjs-mailgun';

@Module({
  imports: [
    Mailgun.forRoot({
      username: 'api',
      key: process.env.MAILGUN_API_KEY,
      public_key: process.env.MAILGUN_PUBLIC_KEY,
      timeout: 10000,
    }),
  ],
})
export class MailgunModule {}
