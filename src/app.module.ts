import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { TeachersModule } from './modules/teachers/teachers.module';
import { StudentsModule } from './modules/students/students.module';
import { ClassroomsModule } from './modules/classrooms/classrooms.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { GroupsModule } from './modules/groups/groups.module';
import { AssignmentsModule } from './modules/assignments/assignments.module';
import { SubmissionsModule } from './modules/submissions/submissions.module';
import { MaterialsModule } from './modules/materials/materials.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { AnswersModule } from './modules/answers/answers.module';
import { PasswordService } from './modules/password/password.service';
import { PrismaService } from './prisma.service';
import { DocfilesModule } from './modules/docfiles/docfiles.module';
import { MediasModule } from './modules/medias/medias.module';
import { StudentInClassroomModule } from './modules/student-in-classroom/student-in-classroom.module';
import { StudentInGroupModule } from './modules/student-in-group/student-in-group.module';
import { ChoiceModule } from './modules/choice/choice.module';
import { DropboxService } from './modules/dropbox/dropbox.service';
import { DropboxModule } from './modules/dropbox/dropbox.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    RolesModule,
    TeachersModule,
    StudentsModule,
    ClassroomsModule,
    SessionsModule,
    GroupsModule,
    AssignmentsModule,
    SubmissionsModule,
    MaterialsModule,
    QuestionsModule,
    AnswersModule,
    DocfilesModule,
    MediasModule,
    StudentInClassroomModule,
    StudentInGroupModule,
    ChoiceModule,
    DropboxModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, PasswordService, DropboxService],
})
export class AppModule {}
