import { type User } from '@/types';

export const mockUsers: User[] = [
  {
    id: 1,
    username: 'alex_dev',
    email: 'alex.kovalenko@example.com',
    role: 'ADMIN',
    password: '123123123',
  },
  {
    id: 2,
    username: 'mariya_b',
    email: 'mariya.boyko@example.com',
    role: 'USER',
    password: '123123123',
  },
  {
    id: 3,
    username: 'dmitry_tech',
    email: 'dmytro.s@example.com',
    role: 'USER',
    password: '123123123',
  },
];
