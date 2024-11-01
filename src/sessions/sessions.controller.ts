import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { CreateSessionDto } from './dto/create-session.dto';
import { PaginationRequest } from 'src/interfaces/pagination-request.interface';
import { UpdateSessionDto } from './dto/update-session.dto';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  async createSession(@Body() createSessionDto: CreateSessionDto) {
    await this.sessionsService.createSession(createSessionDto);
    return { message: 'Session created successfully' };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher', 'student')
  async getSessionInformation(@Param('id') sessionId: string) {
    return await this.sessionsService.getSessionInformation(sessionId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  async updateSessionInformation(
    @Param('id') sessionId: string,
    @Body() updateSessionDto: UpdateSessionDto,
  ) {
    await this.sessionsService.updateSessionInformation(
      sessionId,
      updateSessionDto,
    );
    return { message: 'Session updated successfully' };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  async deleteSession(@Param('id') sessionId: string) {
    await this.sessionsService.deleteSession(sessionId);
    return { message: 'Session deleted successfully' };
  }
}
