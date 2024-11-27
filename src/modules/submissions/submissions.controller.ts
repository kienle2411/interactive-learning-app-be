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
import { SubmissionsService } from './submissions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { CreateSubmissionDto } from './dto/create-submission.dto';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateSubmissionInformation(
    @Param('id') submissionId: string,
    @Body() updateSubmissionDto: UpdateSubmissionDto,
  ) {
    return await this.submissionsService.updateSubmissionInformation(
      submissionId,
      updateSubmissionDto,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteSubmission(@Param('id') submissionId: string) {
    return await this.submissionsService.deleteSubmission(submissionId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getSubmissionInformation(@Param('id') submissionId: string) {
    return await this.submissionsService.getSubmissionInformation(submissionId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createSubmission(@Body() createSubmissionDto: CreateSubmissionDto) {
    return await this.submissionsService.createSubmission(createSubmissionDto);
  }
}
