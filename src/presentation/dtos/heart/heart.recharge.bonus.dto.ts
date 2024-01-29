import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsDate,
    IsDateString,
    IsNumber,
    IsString,
    IsUUID,
} from 'class-validator';

export class HeartRechargeBonusDto {
    @IsUUID()
    @ApiProperty()
    public readonly memberId: string;

    @IsNumber()
    @Type(() => Number)
    @ApiProperty()
    public readonly quantity: number;

    @IsDate()
    @Type(() => Date)
    @ApiProperty({
        type: Date,
        example: '2024-03-19',
        description: 'format YYYY-MM-DD',
    })
    public readonly expiryDate: Date;
}
