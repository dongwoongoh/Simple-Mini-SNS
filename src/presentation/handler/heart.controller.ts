import { DATABASE_ERROR } from '@/common/contants/error';
import { HeartServiceInterface } from '@/domain/services/heart/heart.service.interface';
import {
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  Param,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Controller('hearts')
export class HeartController {
  constructor(
    @Inject('HEART_SERVICE') private readonly service: HeartServiceInterface,
  ) {}

  @Get(':memberId')
  public async getTotalHearts(@Param('memberId') memberId: string) {
    try {
      const totalHearts = await this.service.getTotalHearts(memberId);
      return { totalHearts };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new Error(DATABASE_ERROR);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
