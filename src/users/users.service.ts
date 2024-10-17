import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma, User } from '@prisma/client';
import { PasswordService } from 'src/password/password.service';
import { TeachersService } from 'src/teachers/teachers.service';
import { StudentsService } from 'src/students/students.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly passwordService: PasswordService,
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
    await this.teacherService.createTeacher(user.id);
    return user;
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async getAllUsers() {
    return this.prisma.user.findMany();
  }

  async getUserById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async updateUser(id: string, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({ where: { id }, data });
  }

  async deleteUser(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
