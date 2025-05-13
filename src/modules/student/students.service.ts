import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UserService } from '@/modules/user/user.service';
import { PaginationHelper } from '@/common/helpers';

@Injectable()
export class StudentService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => UserService))
    private usersService: UserService,
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
      this.prisma.studentClassroom,
      { studentId },
      { page, limit },
      {
        select: {
          classroom: {
            include: {
              teacher: {
                select: {
                  user: {
                    select: {
                      firstName: true,
                      lastName: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    );
  }
}
