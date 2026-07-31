import client from './client';

export const authApi = {
  // Response is { accessToken, refreshToken, expiresInSeconds, user }.
  login: (email, password) =>
    client.post('/auth/login', { email, password }).then((r) => r.data),

  // Role is always USER server-side — payload is just { email, password, name, phone }.
  register: (payload) => client.post('/auth/register', payload).then((r) => r.data),

  me: () => client.get('/user/me').then((r) => r.data),
};
