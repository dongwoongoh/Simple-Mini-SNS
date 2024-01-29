import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class HeartRechargeRegularDto {
    @IsNumber()
    @Type(() => Number)
    @ApiProperty()
    public readonly quantity: number;
}
