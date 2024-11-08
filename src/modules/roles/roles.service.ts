import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async getRoleById(id: string): Promise<Role> {
    return this.prisma.role.findUnique({ where: { id } });
  }
}
