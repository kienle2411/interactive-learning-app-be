import { Body, Controller, Get, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from '@prisma/client';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  createRole(@Body('roleName') roleName: string): Promise<Role> {
    return this.rolesService.createRole(roleName);
  }

  @Get()
  getAllRoles(): Promise<Role[]> {
    return this.rolesService.getAllRoles();
  }
}
