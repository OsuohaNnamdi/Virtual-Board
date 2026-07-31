import client from './client';

const BASE = '/services/notice-board/forum/questions';

export const questionApi = {
  list: () => client.get(BASE).then((r) => r.data),
  get: (id) => client.get(`${BASE}/${id}`).then((r) => r.data),
  add: (payload) => client.post(BASE, payload).then((r) => r.data),
  update: (id, payload) => client.put(`${BASE}/${id}`, payload).then((r) => r.data),
  remove: (id) => client.delete(`${BASE}/${id}`).then((r) => r.data),

  // Note: the backend has no upvote/downvote endpoint for questions — only answers.
};
