import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PaginationParams } from '@/common/helpers';
import { CreateStudentInClassroomDto } from '../student-in-classroom/dto/create-student-in-classroom.dto';
import { CreateStudentInGroupDto } from '../student-in-group/dto/create-student-in-group.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getGroupInformation(@Param('id') groupId: string) {
    return await this.groupsService.getGroupInformation(groupId);
  }

  @Get(':id/members')
  @UseGuards(JwtAuthGuard)
  async getGroupMembers(
    @Param('id') groupId: string,
    @Query() req: PaginationParams,
  ) {
    const { page, limit } = req;
    return await this.groupsService.getGroupMembers(groupId, page, limit);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async editGroupInformation(
    @Param('id') groupId: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    return await this.groupsService.editGroupInformation(
      groupId,
      updateGroupDto,
    );
  }

  @Post(':id/members')
  @UseGuards(JwtAuthGuard)
  async addMember(
    @Param('id') groupId: string,
    @Body() createStudentInGroup: CreateStudentInGroupDto,
  ) {
    return await this.groupsService.addMember(groupId, createStudentInGroup);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  async deleteGroup(@Param('id') groupId: string) {
    return await this.groupsService.deleteGroup(groupId);
  }
}
