import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
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

  @Admin()
  @Put(':id')
  @ApiOperation({ description: 'Edit reader' })
  edit(@Param('id') id: string, @Body() { name }: NameDto): boolean {
    this.readersService.edit(id, name);
    return true;
  }

  @Admin()
  @Delete(':id')
  @ApiOperation({ description: 'Remove reader' })
  @ApiTags('books')
  remove(@Param('id') id: string): boolean {
    this.readersService.remove(id);
    return true;
  }
}
