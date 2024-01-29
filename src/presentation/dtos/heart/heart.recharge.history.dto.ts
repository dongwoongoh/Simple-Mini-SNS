import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class HeartRechargeHistoryDto {
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    @ApiPropertyOptional({ name: 'limit(optional)' })
    limit?: number;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({
        name: 'cursor(optional)',
        description: 'enter chargedAt. ex) 2024-01-29 21:56:28.003',
    })
    cursor?: string;
}
