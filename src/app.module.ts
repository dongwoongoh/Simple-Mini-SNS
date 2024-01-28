import { Module } from '@nestjs/common';
import { MemberModule } from './member.module';

@Module({
    imports: [MemberModule],
    providers: [],
    controllers: [],
})
export class AppModule {}
