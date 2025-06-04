import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../models/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findOne(email);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  async generateToken(user: User): Promise<string> {
    const payload = { email: user.email, sub: user._id.toString() };
    return this.jwtService.sign(payload);
  }

  async login(user: User) {
    const access_token = await this.generateToken(user);
    return {
      token: access_token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
      ok: true
    }
  }

  async validateToken(token: string): Promise<{ ok: boolean; status: number; user?: any }> {
    try {
      const payload = await this.jwtService.verify(token);
      const user = await this.usersService.findOne(payload.email);

      if (!user) {
        return { ok: false, status: 401 };
      }

      return {
        ok: true,
        status: 200,
        user: user
      };
    } catch (error) {
      return { ok: false, status: 401 };
    }
  }
} 