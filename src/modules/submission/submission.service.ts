import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';
import { UpdateSubmissionDto } from './dto/update-submission.dto';

@Injectable()
export class SubmissionService {
  constructor(private readonly prisma: PrismaService) {}

  async updateSubmissionInformation(
    submissionId: string,
    updateSubmissionDto: UpdateSubmissionDto,
  ) {
    return this.prisma.submission.update({
      where: { id: submissionId },
      data: {
        ...updateSubmissionDto,
      },
    });
  }

  async deleteSubmission(submissionId: string) {
    return this.prisma.submission.delete({
      where: { id: submissionId },
    });
  }

  async getSubmissionInformation(submissionId: string) {
    return this.prisma.submission.findUnique({
      where: { id: submissionId },
    });
  }
}
