import { Body, Controller, Get, Post } from '@nestjs/common';
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
}
