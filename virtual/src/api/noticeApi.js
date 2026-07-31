import client from './client';

const BASE = '/services/notice-board/notices';

export const noticeApi = {
  // GET /notices is not scoped — it returns every notice regardless of audience.
  list: (page = 0, size = 20) => client.get(BASE, { params: { page, size } }).then((r) => r.data),
  listByFaculty: (faculty) => client.get(`${BASE}/faculty/${encodeURIComponent(faculty)}`).then((r) => r.data),
  listByDepartment: (department) => client.get(`${BASE}/department/${encodeURIComponent(department)}`).then((r) => r.data),
  get: (id) => client.get(`${BASE}/${id}`).then((r) => r.data),

  // The backend takes multipart with two named parts — `notice` (JSON) and
  // an optional `image` file — not a flat form-encoded body.
  create: (notice, image) => {
    const formData = new FormData();
    formData.append('notice', new Blob([JSON.stringify(notice)], { type: 'application/json' }));
    if (image) formData.append('image', image);
    return client.post(BASE, formData).then((r) => r.data);
  },

  // Update is plain JSON and only touches subject/source/content/date —
  // the backend has no way to change audience or the image after creation.
  update: (id, notice) => client.put(`${BASE}/${id}`, notice).then((r) => r.data),

  remove: (id) => client.delete(`${BASE}/${id}`).then((r) => r.data),
};
