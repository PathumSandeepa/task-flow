export interface Task {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
}

export type FilterStatus = 'all' | 'completed' | 'incomplete';

export interface CreateTaskDto {
  title: string;
}

export interface UpdateTaskDto {
  title: string;
}

export interface SignupDto {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  passwordHash: string;
}

export interface JwtPayload {
  sub: number;
  username: string;
}