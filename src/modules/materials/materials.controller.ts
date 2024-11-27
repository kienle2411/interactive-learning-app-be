import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { MaterialsService } from './materials.service';

@Controller('materials')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  async updateMaterialInformation(
    @Param('id') materialId: string,
    @Body() updateMaterialDto: UpdateMaterialDto,
  ) {
    return await this.materialsService.updateMaterialInformation(
      materialId,
      updateMaterialDto,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getMaterialInformation(@Param() materialId: string) {
    return await this.materialsService.getMaterialInformation(materialId);
  }
}
