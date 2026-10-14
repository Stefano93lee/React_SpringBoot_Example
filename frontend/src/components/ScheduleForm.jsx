import { useState } from 'react';

export default function ScheduleForm({ onSubmit, submitting }) {
  const [content, setContent] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || submitting) return;

    const success = await onSubmit(trimmed);
    if (success) setContent('');
  };

  const handleCancel = () => {
    setContent('');
  };

  return (
    <form className="schedule-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="할 일을 입력하세요"
        maxLength={255}
        aria-label="일정 내용"
        disabled={submitting}
      />
      <button type="submit" className="btn btn-primary" disabled={submitting || !content.trim()}>
        {submitting ? '등록 중…' : '등록'}
      </button>
      <button type="button" className="btn" onClick={handleCancel} disabled={submitting}>
        취소
      </button>
    </form>
  );
}
