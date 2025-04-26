import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import path from 'path';
import fs from 'fs/promises';
import { MailgunMessageData, MailgunService } from 'nestjs-mailgun';

@Injectable()
export class EmailService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailgunService: MailgunService,
  ) {}

  async sendEmail(email: string) {
    const options: MailgunMessageData = {
      from: this.configService.get('FROM_EMAIL'),
      to: email,
      subject: 'Test Email',
      text: 'This is a test email sent using Mailgun.',
      html: '<h1>This is a test email sent using Mailgun.</h1>',
    };
    console.log('Mailgun options: ', options);
    console.log('Mailgun domain: ', process.env.DOMAIN);
    return this.mailgunService.createEmail(process.env.DOMAIN, options);
  }

  async sendWelcomeEmail(email: string, name: string) {
    const templatePath = path.join(
      __dirname,
      '../../../src/modules/email/email-template/welcome-email.html',
    );
    let htmlContent = await fs.readFile(templatePath, 'utf-8');

    htmlContent = htmlContent.replace('{{name}}', name);

    const options: MailgunMessageData = {
      from: this.configService.get('FROM_EMAIL'),
      to: email,
      subject: `Hello ${name}, welcome to our service!`,
      html: htmlContent,
    };
    return this.mailgunService.createEmail(process.env.DOMAIN, options);
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const templatePath = path.join(
      __dirname,
      '../../../src/modules/email/email-template/reset-password-email.html',
    );
    let htmlContent = await fs.readFile(templatePath, 'utf-8');

    htmlContent = htmlContent.replace(
      '{{resetLink}}',
      `${process.env.FRONTEND_URL}/reset-password?token=${token}`,
    );

    const options: MailgunMessageData = {
      from: this.configService.get('FROM_EMAIL'),
      to: email,
      subject: 'Password Reset Request',
      html: htmlContent,
    };
    return this.mailgunService.createEmail(process.env.DOMAIN, options);
  }
}
