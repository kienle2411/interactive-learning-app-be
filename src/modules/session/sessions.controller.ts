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
import { SessionService } from './session.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { UpdateSessionDto } from './dto/update-session.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher', 'student')
  async getSessionInformation(@Param('id') sessionId: string) {
    return await this.sessionService.getSessionInformation(sessionId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  async updateSessionInformation(
    @Param('id') sessionId: string,
    @Body() updateSessionDto: UpdateSessionDto,
  ) {
    await this.sessionService.updateSessionInformation(
      sessionId,
      updateSessionDto,
    );
    return { message: 'Session updated successfully' };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  async deleteSession(@Param('id') sessionId: string) {
    await this.sessionService.deleteSession(sessionId);
    return { message: 'Session deleted successfully' };
  }
}
