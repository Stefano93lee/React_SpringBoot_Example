import { useCallback, useEffect, useState } from 'react';
import ScheduleForm from './components/ScheduleForm.jsx';
import ScheduleList from './components/ScheduleList.jsx';
import { createSchedule, fetchSchedules, getErrorMessage } from './api/scheduleApi.js';

export default function App() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadSchedules = useCallback(async () => {
    try {
      setError('');
      setSchedules(await fetchSchedules());
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

  const handleCreate = async (content) => {
    setSubmitting(true);
    try {
      await createSchedule(content);
      await loadSchedules(); // 등록 후 DB 기준으로 목록 갱신
      return true;
    } catch (err) {
      setError(getErrorMessage(err));
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container">
      <h1>일정 관리</h1>
      <ScheduleForm onSubmit={handleCreate} submitting={submitting} />
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <section>
        <h2>일정 목록 ({schedules.length})</h2>
        <ScheduleList schedules={schedules} loading={loading} />
      </section>
    </main>
  );
}
