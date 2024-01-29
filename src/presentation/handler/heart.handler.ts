import { HeartServiceInterface } from '@/domain/services/heart/heart.service.interface';
import {
    Controller,
    Get,
    HttpException,
    Inject,
    InternalServerErrorException,
    Param,
    Query,
} from '@nestjs/common';
import { HeartQuantityDto } from '../dtos/heart/heart.quantity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('hearts')
@ApiTags('Hearts')
export class HeartController {
    constructor(
        @Inject('HEART_SERVICE')
        private readonly service: HeartServiceInterface,
    ) {}
    @Get()
    @ApiOperation({ summary: 'my hearts quantity' })
    private async hearts(@Query() { memberId }: HeartQuantityDto) {
        try {
            const quantity = await this.service.getTotalHearts(memberId);
            return { quantity };
        } catch (error) {
            if (error instanceof HttpException) {
                throw new InternalServerErrorException();
            }
        }
    }
}
