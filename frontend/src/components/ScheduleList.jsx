const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export default function ScheduleList({ schedules, loading }) {
  if (loading) {
    return <p className="status">불러오는 중…</p>;
  }

  if (schedules.length === 0) {
    return <p className="status">등록된 일정이 없습니다.</p>;
  }

  return (
    <ul className="schedule-list">
      {schedules.map((schedule) => (
        <li key={schedule.id} className="schedule-item">
          <span className="schedule-content">{schedule.content}</span>
          <time className="schedule-date" dateTime={schedule.createdAt}>
            {dateFormatter.format(new Date(schedule.createdAt))}
          </time>
        </li>
      ))}
    </ul>
  );
}
