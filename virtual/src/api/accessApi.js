import client from './client';

export const accessApi = {
  request: (service, requestedLevel, reason) =>
    client.post('/user/access-requests', { service, requestedLevel, reason }).then((r) => r.data),

  myRequests: () => client.get('/user/access-requests').then((r) => r.data),

  myGrants: () => client.get('/user/access-grants').then((r) => r.data),
};
