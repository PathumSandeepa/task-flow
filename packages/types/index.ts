export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
}

export type FilterStatus = 'all' | 'completed' | 'incomplete';