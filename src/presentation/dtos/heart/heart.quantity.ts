import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class HeartQuantityDto {
    @IsUUID()
    @ApiProperty()
    public memberId: string;
}
