import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma, User } from '@prisma/client';
import { PasswordService } from 'src/password/password.service';
import { TeachersService } from 'src/teachers/teachers.service';
import { StudentsService } from 'src/students/students.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly roleService: RolesService,
    private readonly teacherService: TeachersService,
    private readonly studentService: StudentsService,
  ) {}

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
      await this.studentService.createStudent({ userId: user.id });
    } else {
      await this.teacherService.createTeacher({ userId: user.id });
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
