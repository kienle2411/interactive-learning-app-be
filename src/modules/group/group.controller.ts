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
import { GroupService } from './group.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PaginationParams } from '@/common/helpers';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AddStudentGroupDto } from './dto/add-student-group.dto';

@ApiBearerAuth()
@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getGroupInformation(@Param('id') groupId: string) {
    return await this.groupService.getGroupInformation(groupId);
  }

  @Get(':id/members')
  @UseGuards(JwtAuthGuard)
  async getGroupMembers(
    @Param('id') groupId: string,
    @Query() req: PaginationParams,
  ) {
    const { page, limit } = req;
    return await this.groupService.getGroupMembers(groupId, page, limit);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async editGroupInformation(
    @Param('id') groupId: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    return await this.groupService.updateGroupInformation(
      groupId,
      updateGroupDto,
    );
  }

  @Post(':id/members')
  @UseGuards(JwtAuthGuard)
  async addMember(
    @Param('id') groupId: string,
    @Body() addStudentGroupDto: AddStudentGroupDto,
  ) {
    return await this.groupService.addMember(groupId, addStudentGroupDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  async deleteGroup(@Param('id') groupId: string) {
    return await this.groupService.deleteGroup(groupId);
  }
}
