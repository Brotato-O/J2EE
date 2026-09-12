export interface MockUser {
  username: string;
  password: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const mockUsers: MockUser[] = [
  {
    username: 'user',
    password: 'password',
    token: 'fake-jwt-token',
    user: {
      id: 'demo-user',
      name: 'Test User',
      email: 'user@example.com',
    },
  },
];