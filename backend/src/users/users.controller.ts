import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { Admin } from 'src/auth/admin.decorator';

@Admin()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({ description: 'Get user list' })
  async getAll() {
    return this.usersService.findAll();
  }

  @Post()
  @ApiOperation({ description: 'Create user' })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ description: 'Update user' })
  async update(@Param('id') id: string, @Body() { password, ...update }: UpdateUserDto): Promise<true> {
    const otherId = await this.usersService.findIdByLogin(update.login);
    if (otherId && otherId.toString() !== id) {
      throw new BadRequestException(`login ${update.login} is already used`);
    }

    await this.usersService.update(id, update);
    await this.usersService.updatePassword(id, password);
    return true;
  }

  @Put('active/:id')
  @ApiOperation({ description: 'Grant admin rights to user' })
  async activate(@Param('id') id: string): Promise<true> {
    await this.usersService.update(id, { enabled: true });
    return true;
  }

  @Delete('active/:id')
  @ApiOperation({ description: 'Revoke admin rights from user' })
  async deactivate(@Param('id') id: string): Promise<true> {
    if (await this.usersService.isAdmin(id)) {
      throw new BadRequestException("you can't deactivate admin");
    }
    await this.usersService.update(id, { enabled: false });
    return true;
  }

  @Put('admin/:id')
  @ApiOperation({ description: 'Grant admin rights to user' })
  async grant(@Param('id') id: string): Promise<true> {
    if (!(await this.usersService.isActive(id))) {
      throw new BadRequestException("Can't grant admin rights to inactive user");
    }
    await this.usersService.update(id, { admin: true });
    return true;
  }

  @Delete('admin/:id')
  @ApiOperation({ description: 'Revoke admin rights from user' })
  async revoke(@Param('id') id: string, @Request() req): Promise<true> {
    if (req.user.id === id) {
      throw new BadRequestException("you can't revoke admin rignts from yourself");
    }
    await this.usersService.update(id, { admin: false });
    return true;
  }
}
