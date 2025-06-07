import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';
import { access } from 'fs';
import { AccessToken } from 'livekit-server-sdk';

@Injectable()
export class MeetingService {
  constructor(private readonly prisma: PrismaService) {}

  async getMeetingInformation(meetingId: string) {
    return this.prisma.meeting.findUnique({
      where: { id: meetingId },
    });
  }

  async getMeetingAccessToken(userId: string, meetingId: string) {
    const meeting = await this.prisma.meeting.findUnique({
      where: { id: meetingId },
    });
    const now = new Date();
    if (!meeting) {
      throw new Error('Meeting not found');
    }
    if (meeting.startTime > now) {
      throw new Error('Meeting has not started yet');
    }
    if (meeting.endTime < now) {
      throw new Error('Meeting has already ended');
    }
    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      {
        identity: userId,
      },
    );
    at.addGrant({
      roomJoin: true,
      room: meetingId,
    });
    return {
      accessToken: (await at.toJwt()).toString(),
      roomName: meetingId,
    };
  }
}
