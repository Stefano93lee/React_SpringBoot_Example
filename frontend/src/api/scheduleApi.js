import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
  // Render 무료 플랜은 유휴 후 첫 요청에 수십 초가 걸릴 수 있어 여유 있게 설정
  timeout: 60000,
});

export async function fetchSchedules() {
  const { data } = await api.get('/api/schedules');
  return data;
}

export async function createSchedule(content) {
  const { data } = await api.post('/api/schedules', { content });
  return data;
}

export function getErrorMessage(error) {
  return error.response?.data?.message ?? '서버와 통신하지 못했습니다. 잠시 후 다시 시도해주세요.';
}
