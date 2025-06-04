import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from '../../services/users.service';
import { CreateUserDto } from '../../models/dtos/create-user.dto';
import { CreateUserWithRoleDto } from '../../models/dtos/create-user-with-role.dto';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('register-with-role')
  async createWithRole(@Body() createUserWithRoleDto: CreateUserWithRoleDto) {
    return this.usersService.createWithRole(createUserWithRoleDto);
  }
} 