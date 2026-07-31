import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="not-found-screen">
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: 28,
          background: 'var(--brand-grad)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 40,
          fontWeight: 800,
          color: 'white',
          boxShadow: 'var(--shadow-lg)',
          marginBottom: 8,
        }}
      >
        404
      </div>
      <h1 className="page-title" style={{ marginBottom: 0 }}>Whoops! Page not found</h1>
      <p className="page-subtitle">That page doesn't exist, or it moved.</p>
      <Link to="/" className="btn btn-primary">Back to notices</Link>
    </div>
  );
}
