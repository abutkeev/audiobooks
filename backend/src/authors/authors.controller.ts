import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Admin } from 'src/auth/admin.decorator';
import NameDto from 'src/persons/dto/NameDto';
import PersonDto from 'src/persons/dto/PersonDto';
import { AuthorsService } from './authors.service';

@ApiTags('authors')
@Controller('authors')
export class AuthorsController {
  constructor(private authorsService: AuthorsService) {}

  @Get()
  @ApiOperation({ description: 'Get authors list' })
  get(): PersonDto[] {
    return this.authorsService.get();
  }

  @Admin()
  @Post()
  @ApiOperation({ description: 'Create author' })
  create(@Body() { name }: NameDto): boolean {
    this.authorsService.create(name);
    return true;
  }

  @Admin()
  @Put(':id')
  @ApiOperation({ description: 'Edit author' })
  edit(@Param('id') id: string, @Body() { name }: NameDto): boolean {
    this.authorsService.edit(id, name);
    return true;
  }

  @Admin()
  @Delete(':id')
  @ApiOperation({ description: 'Remove author' })
  @ApiTags('books')
  remove(@Param('id') id: string): boolean {
    this.authorsService.remove(id);
    return true;
  }
}
