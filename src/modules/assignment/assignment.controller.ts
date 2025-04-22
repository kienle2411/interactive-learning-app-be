import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Request } from 'express';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateAssignmentSubmissionDto } from './dto/create-assignment-submission.dto';

@ApiBearerAuth()
@Controller('assignments')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  // @Get()
  // @UseGuards(JwtAuthGuard)
  // async getAllAssignment(@Req() req: Request) {
  //   return await this.assignmentService.getAllAssignment(req.user['sub']);
  // }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getAssignmentInformation(@Param('id') assignmentId: string) {
    return await this.assignmentService.getAssignmentInformation(assignmentId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  async updateAssignment(
    @Body() updateAssignmentDto: UpdateAssignmentDto,
    @Param('id') assignmentId: string,
  ) {
    return await this.assignmentService.updateAssignment(
      assignmentId,
      updateAssignmentDto,
    );
  }

  @Get(':id/questions')
  @UseGuards(JwtAuthGuard)
  async getAssigmentQuestions(@Param('id') assignmentId: string) {
    return await this.assignmentService.getAssignmentQuestions(assignmentId);
  }

  @Post(':id/submission')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createAssignmentSubmission(
    @Param('id') assignmentId: string,
    @Req() req: Request,
    @Body() createAssignmentSubmissionDto: CreateAssignmentSubmissionDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.assignmentService.createAssignmentSubmission(
      req.user['sub'],
      assignmentId,
      createAssignmentSubmissionDto,
      file,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  async deleteAssignment(@Param('id') assignmentId: string) {
    return await this.assignmentService.deleteAssignment(assignmentId);
  }
}
