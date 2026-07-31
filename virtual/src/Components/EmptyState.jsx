export default function EmptyState({ icon = '✦', title, message, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <div style={{ fontWeight: 700, fontSize: 15.5, color: 'var(--ink-900)' }}>{title}</div>
      {message && <div style={{ fontSize: 14 }}>{message}</div>}
      {action}
    </div>
  );
}
