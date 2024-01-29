import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class HeartQuantityDto {
    @IsUUID()
    @ApiProperty()
    public readonly memberId: string;
}
