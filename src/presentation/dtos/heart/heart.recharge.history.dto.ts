import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class HeartRechargeHistoryDto {
    @IsNumber()
    @Type(() => Number)
    @ApiPropertyOptional()
    limit?: number;

    @IsString()
    @ApiPropertyOptional()
    cursor?: string;
}
