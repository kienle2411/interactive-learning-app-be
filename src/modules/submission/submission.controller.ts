import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('submissions')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateSubmissionInformation(
    @Param('id') submissionId: string,
    @Body() updateSubmissionDto: UpdateSubmissionDto,
  ) {
    return await this.submissionService.updateSubmissionInformation(
      submissionId,
      updateSubmissionDto,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteSubmission(@Param('id') submissionId: string) {
    return await this.submissionService.deleteSubmission(submissionId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getSubmissionInformation(@Param('id') submissionId: string) {
    return await this.submissionService.getSubmissionInformation(submissionId);
  }
}
