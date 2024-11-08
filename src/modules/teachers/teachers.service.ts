import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/modules/users/users.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { PaginationHelper } from '@/common/helpers';

@Injectable()
export class TeachersService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async createTeacher(createTeacherDto: CreateTeacherDto) {
    return this.prisma.teacher.create({
      data: {
        userId: createTeacherDto.userId,
        subjectSpecialization: createTeacherDto.subjectSpecialization,
      },
    });
  }

  async getTeacherClassrooms(
    userId: string,
    page: number = 1,
    limit: number = 0,
  ) {
    const teacherId = await this.usersService.getTeacherIdByUserId(userId);

    return PaginationHelper.paginate(
      this.prisma.classroom,
      { teacherId },
      { page, limit },
    );
  }
}
