'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) { toast.error('Please fill all fields'); return; }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await signup(name, email, password);
      toast.success('Account created! Welcome to Flipkart 🎉');
      router.push('/');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Signup failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-left">
          <h2>Looks like you're new here!</h2>
          <p>Sign up with your details to get started</p>
          <div className="auth-left-img" style={{ textAlign: 'center', fontSize: 80 }}>🎉</div>
        </div>
        <div className="auth-right">
          <h3>Create Account</h3>
          <p className="subtitle">Join millions of happy shoppers</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                id="signup-name"
                type="text"
                className="form-input"
                placeholder="Your full name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                id="signup-email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="signup-password"
                  type={showPw ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ width: '100%', paddingRight: 40 }}
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#9aa0a6', background: 'none', border: 'none', cursor: 'pointer' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading} id="signup-submit-btn">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          <p className="auth-link">
            Existing user? <Link href="/auth/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
