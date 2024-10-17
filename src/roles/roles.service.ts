import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async createRole(roleName: string): Promise<Role> {
    return this.prisma.role.create({
      data: {
        roleName,
      },
    });
  }

  async getAllRoles(): Promise<Role[]> {
    return this.prisma.role.findMany();
  }
}
