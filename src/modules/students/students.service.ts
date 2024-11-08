import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UsersService } from 'src/modules/users/users.service';
import { PaginationHelper } from '@/common/helpers';

@Injectable()
export class StudentsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  async createStudent(createStudentDto: CreateStudentDto) {
    return this.prisma.student.create({
      data: {
        userId: createStudentDto.userId,
      },
    });
  }

  async getStudentClassrooms(
    userId: string,
    page: number = 1,
    limit: number = 0,
  ) {
    const studentId = await this.usersService.getStudentIdByUserId(userId);

    return PaginationHelper.paginate(
      this.prisma.studentInClassroom,
      { studentId },
      { page, limit },
      { select: { classroom: true } },
    );
  }
}
