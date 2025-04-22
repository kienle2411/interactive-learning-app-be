import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Role, User } from '@prisma/client';
import { TeacherService } from '@/modules/teacher/teacher.service';
import { StudentService } from '@/modules/student/students.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CloudinaryService } from '@/modules/cloudinary/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
    @Inject(forwardRef(() => TeacherService))
    private readonly teacherService: TeacherService,
    @Inject(forwardRef(() => StudentService))
    private readonly studentService: StudentService,
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
    return teacher?.id || null;
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

  async createUser(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        dateOfBirth: new Date(createUserDto.dateOfBirth),
      },
    });
    if (createUserDto.role === Role.STUDENT) {
      await this.studentService.createStudent({ userId: user.id });
    } else {
      await this.teacherService.createTeacher({ userId: user.id });
    }
    return user;
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username: username } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      data: {
        ...updateUserDto,
      },
      where: {
        id: id,
      },
    });
  }

  async uploadAvatar(file: Express.Multer.File, userId: string) {
    const uploadResponse = await this.cloudinaryService.uploadFile(file);
    if (!uploadResponse.url) {
      return uploadResponse;
    }
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        avatarUrl: uploadResponse.url,
      },
    });
    return uploadResponse;
  }
}
