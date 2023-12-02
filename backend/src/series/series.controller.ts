import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { SeriesService } from './series.service';
import SeriesDto from './dto/SeriesDto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Admin } from 'src/auth/admin.decorator';
import NewSeriesDto from './dto/NewSeriesDto';

@ApiTags('series')
@Controller('series')
export class SeriesController {
  constructor(private service: SeriesService) {}

  @Get()
  @ApiOperation({ description: 'Get series list' })
  get(): SeriesDto[] {
    return this.service.get();
  }

  @Admin()
  @Post()
  @ApiOperation({ description: 'Create series' })
  create(@Body() body: NewSeriesDto): boolean {
    this.service.create(body);
    return true;
  }

  @Admin()
  @Put(':id')
  @ApiOperation({ description: 'Edit series' })
  edit(@Param('id') id: string, @Body() body: NewSeriesDto): boolean {
    this.service.edit(id, body);
    return true;
  }
}
