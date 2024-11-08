import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma, User } from '@prisma/client';
import { PasswordService } from 'src/modules/password/password.service';
import { TeachersService } from 'src/modules/teachers/teachers.service';
import { StudentsService } from 'src/modules/students/students.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from 'src/modules/roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly roleService: RolesService,
    @Inject(forwardRef(() => TeachersService))
    private readonly teachersService: TeachersService,
    @Inject(forwardRef(() => StudentsService))
    private studentsService: StudentsService,
  ) {}

  private teacherCache = new Map<string, string>();
  private studentCache = new Map<string, string>();

  async getTeacherIdByUserId(userId: string): Promise<string | null> {
    if (this.teacherCache.has(userId)) {
      return this.teacherCache.get(userId);
    }

    const teacher = await this.prisma.teacher.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!teacher) {
      throw new NotFoundException('Teacher Not Found');
    }

    this.teacherCache.set(userId, teacher.id);
    return teacher.id;
  }

  async getStudentIdByUserId(userId: string): Promise<string | null> {
    if (this.studentCache.has(userId)) {
      return this.studentCache.get(userId);
    }

    const student = await this.prisma.student.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!student) {
      throw new NotFoundException('Student Not Found');
    }

    this.studentCache.set(userId, student.id);
    return student.id;
  }

  async createUser(data: CreateUserDto) {
    const hashedPassword = await this.passwordService.hashPassword(
      data.password,
    );
    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        dateOfBirth: new Date(data.dateOfBirth),
      },
    });
    const role = await this.roleService.getRoleById(data.roleId);
    if (role.roleName === 'student') {
      await this.studentsService.createStudent({ userId: user.id });
    } else {
      await this.teachersService.createTeacher({ userId: user.id });
    }
    return user;
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async getUserById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async getAllUsers() {
    return this.prisma.user.findMany();
  }
}
