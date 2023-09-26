import { Module } from '@nestjs/common';
import { PersonsService } from './persons.service';
import { CommonModule } from 'src/common/common.module';
import { CommonService } from 'src/common/common.service';

@Module({
  imports: [CommonModule],
  providers: [PersonsService, CommonService],
  exports: [PersonsService],
})
export class PersonsModule {}
