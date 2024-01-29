import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class HeartUseDto {
    @IsNumber()
    @Type(() => Number)
    @ApiProperty()
    public readonly quantity: number;
}
