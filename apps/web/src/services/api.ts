import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1',
});

let accessToken: string | null = null;
let refreshToken: string | null = null;

export function setTokens(tokens: { accessToken: string; refreshToken: string } | null) {
  accessToken = tokens?.accessToken ?? null;
  refreshToken = tokens?.refreshToken ?? null;
  if (tokens) {
    sessionStorage.setItem('hisdata_refresh', tokens.refreshToken);
  } else {
    sessionStorage.removeItem('hisdata_refresh');
  }
}

export function getStoredRefreshToken() {
  return sessionStorage.getItem('hisdata_refresh');
}

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let refreshing: Promise<void> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && refreshToken && !original._retry) {
      original._retry = true;
      refreshing =
        refreshing ??
        api
          .post('/auth/refresh', { refreshToken })
          .then(({ data }) => {
            setTokens(data);
          })
          .finally(() => {
            refreshing = null;
          });

      await refreshing;
      original.headers.Authorization = `Bearer ${accessToken}`;
      return api(original);
    }
    return Promise.reject(error);
  },
);
