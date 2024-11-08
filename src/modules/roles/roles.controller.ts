import { Body, Controller, Get, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from '@prisma/client';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  async getRoleById(id: string): Promise<Role> {
    return this.rolesService.getRoleById(id);
  }
}
