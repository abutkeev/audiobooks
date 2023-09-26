import { Module } from '@nestjs/common';
import { ReadersService } from './readers.service';
import { ReadersController } from './readers.controller';
import { PersonsModule } from 'src/persons/persons.module';
import { PersonsService } from 'src/persons/persons.service';
import { CommonService } from 'src/common/common.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule, PersonsModule],
  providers: [ReadersService, PersonsService, CommonService],
  controllers: [ReadersController],
})
export class ReadersModule {}
