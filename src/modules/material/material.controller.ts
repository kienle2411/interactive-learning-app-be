import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { MaterialService } from './material.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { DropboxService } from '../dropbox/dropbox.service';

@ApiBearerAuth()
@Controller('materials')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  async updateMaterialInformation(
    @Param('id') materialId: string,
    @Body() updateMaterialDto: UpdateMaterialDto,
  ) {
    return await this.materialService.updateMaterialInformation(
      materialId,
      updateMaterialDto,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getMaterialInformation(@Param('id') materialId: string) {
    return await this.materialService.getMaterialInformation(materialId);
  }
}
