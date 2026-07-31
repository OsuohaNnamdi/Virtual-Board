import axios from 'axios';

const baseURL = 'https://bundle-api-bqfx.onrender.com/api';

const client = axios.create({ baseURL });

// Every previous version of this app had two or three components building
// their own axios call with a hardcoded localhost URL instead of using this
// instance — which meant the token header silently never got attached on
// those calls. Centralizing it here means that class of bug can't recur.
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function clearSession() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
}

// Access tokens are short-lived (15 min). Rather than log the user out the
// moment one expires, swap it for a fresh pair using the refresh token and
// silently retry the request once. Concurrent 401s share a single in-flight
// refresh call instead of each firing their own.
let refreshPromise = null;

function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return Promise.reject(new Error('No refresh token'));

  if (!refreshPromise) {
    refreshPromise = axios
      .post(`${baseURL}/auth/refresh`, { refreshToken })
      .then((res) => {
        localStorage.setItem('accessToken', res.data.accessToken);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        return res.data.accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

client.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { config, response } = error;
    if (response?.status === 401 && !config._retried && localStorage.getItem('refreshToken')) {
      config._retried = true;
      try {
        const token = await refreshAccessToken();
        config.headers.Authorization = `Bearer ${token}`;
        return client(config);
      } catch {
        clearSession();
      }
    } else if (response?.status === 401) {
      clearSession();
    }
    return Promise.reject(error);
  }
);

export function extractErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  const data = error?.response?.data;
  if (!data) return error?.message || fallback;
  if (typeof data === 'string') return data;
  return data.message || data.error || fallback;
}

export default client;
