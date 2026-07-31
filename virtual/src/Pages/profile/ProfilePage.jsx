import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../../Components/Avatar';

export default function ProfilePage() {
  const { profile, grants } = useAuth();

  if (!profile) return null;

  const fields = [
    ['Email', profile.email],
    ['Phone', profile.phone],
    ['Role', profile.role],
    ['Account status', profile.enabled ? 'Enabled' : 'Disabled'],
  ];

  return (
    <div className="page page-narrow">
      <div className="profile-hero">
        <Avatar name={profile.name || profile.email} size={64} />
        <div>
          <h1>{profile.name || profile.email}</h1>
        </div>
      </div>

      <div className="card">
        <div className="profile-grid">
          {fields.map(([label, value]) => (
            <div key={label}>
              <div className="profile-field-label">{label}</div>
              <div className="profile-field-value">{value || '—'}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>Service access</h3>
        {grants.length === 0 ? (
          <p style={{ margin: 0 }}>
            No service grants yet. <Link to="/request-access">Request notice board access</Link>.
          </p>
        ) : (
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {grants.map((g) => (
              <li key={g.id}>{g.service} — {g.level}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
