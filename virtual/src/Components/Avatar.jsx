function initialsOf(text = '') {
  return text.split(/[\s.]+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('') || '?';
}

export default function Avatar({ name, size = 34, style }) {
  return (
    <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.38, ...style }}>
      {initialsOf(name)}
    </div>
  );
}
