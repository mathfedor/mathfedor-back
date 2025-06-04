import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';
import { UserRole } from '../schemas/user.schema';

export class CreateUserWithRoleDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;

  @IsEnum(UserRole)
  role: UserRole;
} 