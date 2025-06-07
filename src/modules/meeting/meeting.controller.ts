import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { MeetingService } from './meeting.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Request } from 'express';

@Controller('meetings')
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher', 'student')
  async getMeetingInformation(@Param('id') meetingId: string) {
    return await this.meetingService.getMeetingInformation(meetingId);
  }

  @Get(':id/access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher', 'student')
  async getMeetingAccessToken(
    @Req() req: Request,
    @Param('id') meetingId: string,
  ) {
    return await this.meetingService.getMeetingAccessToken(
      req.user['sub'],
      meetingId,
    );
  }
}
