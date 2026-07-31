import client from './client';

const BASE = '/services/notice-board/forum/answers';

export const answerApi = {
  list: (questionId) => client.get(`/services/notice-board/forum/questions/${questionId}/answers`).then((r) => r.data),
  add: (payload) => client.post(BASE, payload).then((r) => r.data),
  upvote: (id) => client.post(`${BASE}/${id}/upvote`).then((r) => r.data),
  downvote: (id) => client.post(`${BASE}/${id}/downvote`).then((r) => r.data),
};
