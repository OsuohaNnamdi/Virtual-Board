import client from './client';

export const commentApi = {
  list: (answerId) => client.get(`/services/notice-board/forum/answers/${answerId}/comments`).then((r) => r.data),
  add: (payload) => client.post('/services/notice-board/forum/comments', payload).then((r) => r.data),
};
