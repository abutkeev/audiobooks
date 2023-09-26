import { Module } from '@nestjs/common';
import { ReadersService } from './readers.service';
import { ReadersController } from './readers.controller';
import { CommonModule } from 'src/common/common.module';
import { CommonService } from 'src/common/common.service';

@Module({
  imports: [CommonModule],
  providers: [ReadersService, CommonService],
  controllers: [ReadersController],
})
export class ReadersModule {}
