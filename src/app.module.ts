import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { TeachersModule } from './teachers/teachers.module';
import { StudentsModule } from './students/students.module';
import { ClassroomsModule } from './classrooms/classrooms.module';
import { SessionsModule } from './sessions/sessions.module';
import { GroupsModule } from './groups/groups.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { MaterialsModule } from './materials/materials.module';
import { QuestionsModule } from './questions/questions.module';
import { AnswersModule } from './answers/answers.module';
import { PasswordService } from './password/password.service';
import { PrismaService } from './prisma.service';
import { DocfilesModule } from './docfiles/docfiles.module';
import { MediasModule } from './medias/medias.module';
import { StudentInClassroomModule } from './student-in-classroom/student-in-classroom.module';
import { StudentInGroupModule } from './student-in-group/student-in-group.module';
import { ChoiceModule } from './choice/choice.module';

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
  ],
  controllers: [AppController],
  providers: [AppService, PasswordService, PrismaService],
})
export class AppModule {}
