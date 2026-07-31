import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { extractErrorMessage } from '../../api/client';
import logo from '../../assets/logo.jpeg';

const initialForm = { name: '', email: '', phone: '', password: '', confirmPassword: '' };

export default function RegisterPage() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...payload } = form;
      await register(payload);
      showToast('Account created', 'Welcome to Campus Connect!', 'success');
      navigate('/request-access', { replace: true });
    } catch (err) {
      setError(extractErrorMessage(err, 'Registration failed. Please check your details and try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card" style={{ maxWidth: 480 }}>
        <div className="auth-brand">
          <img src={logo} alt="Campus Connect" />
          <strong style={{ fontSize: 18 }}>Campus Connect</strong>
        </div>
        <h1 className="page-title" style={{ marginBottom: 4 }}>Create your account</h1>
        <p className="page-subtitle" style={{ marginBottom: 24 }}>
          You'll be able to request access to the notice board right after signing up.
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Full name</label>
            <input required value={form.name} onChange={update('name')} placeholder="Jane Doe" />
          </div>

          <div className="field-row">
            <div className="field">
              <label>Email</label>
              <input type="email" required value={form.email} onChange={update('email')} placeholder="jane.doe@lasu.edu.ng" />
            </div>
            <div className="field">
              <label>Phone</label>
              <input value={form.phone} onChange={update('phone')} placeholder="+2348012345678" />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>Password</label>
              <input type="password" required value={form.password} onChange={update('password')} />
              <p className="field-hint">Min 12 characters, with upper, lower, digit and special character.</p>
            </div>
            <div className="field">
              <label>Confirm password</label>
              <input type="password" required value={form.confirmPassword} onChange={update('confirmPassword')} />
            </div>
          </div>

          <button className="btn btn-primary btn-block" disabled={loading} type="submit">
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
}
