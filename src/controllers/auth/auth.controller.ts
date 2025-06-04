import { Controller, Post, Get, Body, UseGuards, Headers, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../services/auth.service';
import { LoginDto } from '../../models/dtos/login.dto';
import { AuthGuard } from '../../modules/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return this.authService.login(user);
  }

  @Get('validate-token')
  @UseGuards(AuthGuard)
  async validateToken(@Headers('authorization') authorization: string) {
    const token = authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No se proporcionó token de autenticación');
    }
    return this.authService.validateToken(token);
  }
} 