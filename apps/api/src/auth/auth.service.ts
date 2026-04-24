import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import type {
  LoginDto,
  SignupDto,
  AuthResponse,
  User,
  JwtPayload,
} from '@task-flow/types';

@Injectable()
export class AuthService {
  private users: User[] = [];
  private idCounter = 2;

  constructor(private readonly jwtService: JwtService) {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync('admin', salt);
    this.users.push({
      id: 1,
      username: 'admin',
      passwordHash,
    });
  }

  async signup(dto: SignupDto): Promise<AuthResponse> {
    const existingUser = this.users.find((u) => u.username === dto.username);
    if (existingUser) {
      throw new ConflictException('Username already taken');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const newUser: User = {
      id: this.idCounter++,
      username: dto.username,
      passwordHash,
    };

    this.users.push(newUser);

    const payload: JwtPayload = { sub: newUser.id, username: newUser.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = this.users.find((u) => u.username === dto.username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { sub: user.id, username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  validateUser(payload: JwtPayload): User | undefined {
    return this.users.find((u) => u.id === payload.sub);
  }
}
