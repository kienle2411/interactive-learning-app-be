import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { TeacherModule } from './modules/teacher/teacher.module';
import { StudentModule } from './modules/student/student.module';
import { ClassroomModule } from './modules/classroom/classroom.module';
import { SessionModule } from './modules/session/sessions.module';
import { GroupModule } from './modules/group/group.module';
import { AssignmentModule } from './modules/assignment/assignment.module';
import { SubmissionModule } from './modules/submission/submission.module';
import { QuestionModule } from './modules/question/question.module';
import { AnswersModule } from './modules/answer/answer.module';
import { PasswordService } from './modules/password/password.service';
import { PrismaService } from './prisma.service';
import { DropboxService } from './modules/dropbox/dropbox.service';
import { DropboxModule } from './modules/dropbox/dropbox.module';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { SessionGateway } from './gateway/session.gateway';
import { EmailService } from './modules/email/email.service';
import { EmailModule } from './modules/email/email.module';
import { JwtService } from '@nestjs/jwt';
import { MailgunModule } from 'nestjs-mailgun';

@Module({
  imports: [
    AuthModule,
    UserModule,
    TeacherModule,
    StudentModule,
    ClassroomModule,
    SessionModule,
    GroupModule,
    AssignmentModule,
    SubmissionModule,
    QuestionModule,
    AnswersModule,
    DropboxModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CloudinaryModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    SessionGateway,
    PrismaService,
    PasswordService,
    DropboxService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    EmailService,
    JwtService,
  ],
})
export class AppModule {}
