import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MeetingService {
  constructor(private readonly prisma: PrismaService) {}

  async getMeetingInformation(meetingId: string) {
    return this.prisma.meeting.findUnique({
      where: { id: meetingId },
    });
  }
}
