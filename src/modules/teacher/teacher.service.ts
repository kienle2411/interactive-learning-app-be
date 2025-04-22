import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserService } from '@/modules/user/user.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { PaginationHelper } from '@/common/helpers';

@Injectable()
export class TeacherService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
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
    const teacherId = await this.userService.getTeacherIdByUserId(userId);

    return PaginationHelper.paginate(
      this.prisma.classroom,
      { teacherId },
      { page, limit },
    );
  }
}
