import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReadersService } from './readers.service';
import { Admin } from 'src/auth/admin.decorator';
import NameDto from 'src/persons/dto/NameDto';
import PersonDto from 'src/persons/dto/PersonDto';

@ApiTags('readers')
@Controller('readers')
export class ReadersController {
  constructor(private readersService: ReadersService) {}

  @Get()
  @ApiOperation({ description: 'Get readers list' })
  get(): PersonDto[] {
    return this.readersService.get();
  }

  @Admin()
  @Post()
  @ApiOperation({ description: 'Create reader' })
  create(@Body() { name }: NameDto): boolean {
    this.readersService.create(name);
    return true;
  }
}
