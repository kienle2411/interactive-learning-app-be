import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';
import { UpdateChoiceDto } from './dto/update-choice.dto';

@Injectable()
export class ChoiceService {
  constructor(private readonly prisma: PrismaService) {}

  async updateChoiceInformation(
    choiceId: string,
    updateChoiceDto: UpdateChoiceDto,
  ) {
    return this.prisma.option.update({
      where: { id: choiceId },
      data: { ...updateChoiceDto },
    });
  }

  async deleteChoice(choiceId: string) {
    return this.prisma.option.delete({
      where: { id: choiceId },
    });
  }
}
