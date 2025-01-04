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
import { AssignmentsService } from './assignments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Request } from 'express';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllAssignment(@Req() req: Request) {
    return await this.assignmentsService.getAllAssignment(req.user['sub']);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getAssignmentInformation(@Param('id') assignmentId: string) {
    return await this.assignmentsService.getAssignmentInformation(assignmentId);
  }

  @Post(':id/join')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('student')
  async joinAssignment(@Req() req: Request, @Param('id') assignmentId: string) {
    return await this.assignmentsService.joinAssignment(
      req.user['sub'],
      assignmentId,
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  async updateAssignment(
    @Body() updateAssignmentDto: UpdateAssignmentDto,
    @Param('id') assignmentId: string,
  ) {
    return await this.assignmentsService.updateAssignment(
      assignmentId,
      updateAssignmentDto,
    );
  }

  @Get(':id/questions')
  @UseGuards(JwtAuthGuard)
  async getAssigmentQuestions(@Param('id') assignmentId: string) {
    return await this.assignmentsService.getAssignmentQuestions(assignmentId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  async deleteAssignment(@Param('id') assignmentId: string) {
    return await this.assignmentsService.deleteAssignment(assignmentId);
  }
}
