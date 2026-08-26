import { blogApi } from '@/utils/utils';
import { http, HttpResponse, type DefaultBodyType, type PathParams } from 'msw';
import { mockUsers } from '../data/users';
import type { User } from '@/types';

export const usersHandler = [
  http.post<PathParams, { username: string; password: string; email: string }>(
    blogApi('/api/auth/register'),
    async ({ request }) => {
      const { username, password, email } = await request.json();

      mockUsers.push({
        id: 333,
        username,
        email,
        password,
        role: 'USER',
      });

      return new HttpResponse(null, { status: 201 });
    }
  ),

  http.post<PathParams, { username: string; password: string }>(
    blogApi('/api/auth/login'),
    async () => {
      return HttpResponse.json({ token: 'jwt_mocked_token' });
    }
  ),

  http.get<PathParams, DefaultBodyType, Omit<User, 'password'>>(
    blogApi('/api/auth/me'),
    () => {
      return HttpResponse.json({
        username: 'feddev',
        email: 'feddev@gmail.com',
        id: 1000,
        role: 'ADMIN',
      });
    }
  ),
];
