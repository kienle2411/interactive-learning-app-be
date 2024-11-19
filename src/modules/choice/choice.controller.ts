import { Controller, Delete, Param, Patch, UseGuards } from '@nestjs/common';
import { ChoiceService } from './choice.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UpdateChoiceDto } from './dto/update-choice.dto';

@Controller('choice')
export class ChoiceController {
  constructor(private readonly choiceService: ChoiceService) {}

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateChoiceInformation(
    @Param('id') choiceId: string,
    updateChoiceDto: UpdateChoiceDto,
  ) {
    return await this.choiceService.updateChoiceInformation(
      choiceId,
      updateChoiceDto,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteChoice(@Param('id') choiceId: string) {
    return await this.choiceService.deleteChoice(choiceId);
  }
}
