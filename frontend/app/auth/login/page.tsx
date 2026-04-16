'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please fill all fields'); return; }
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      router.push('/');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-left">
          <div>
            <h2>Login</h2>
            <p>Get access to your Orders, Wishlist and Recommendations</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <img 
              src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/login_img_c4a81e.png" 
              alt="Login illustration"
              style={{ width: '100%', maxWidth: '200px', objectFit: 'contain' }}
            />
          </div>
        </div>
        <div className="auth-right">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            
            <div className="auth-input-group">
              <input
                id="login-email"
                type="email"
                placeholder="Enter Email/Mobile number"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-input-group">
              <input
                id="login-password"
                type={showPw ? 'text' : 'password'}
                placeholder="Enter Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ paddingRight: 40 }}
                required
              />
              <button type="button" onClick={() => setShowPw(v => !v)}
                style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: '#2874f0', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            
            <p className="auth-terms">
              By continuing, you agree to Flipkart's <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a>.
            </p>

            <button type="submit" className="auth-btn-orange" disabled={loading} id="login-submit-btn">
              {loading ? 'Logging in...' : 'Login / Request OTP'}
            </button>
            
            <div style={{ textAlign: 'center', fontSize: 12, color: '#878787', marginTop: 16 }}>
              Demo: demo@example.com / demo123
            </div>

            <Link href="/auth/signup" className="auth-link">
              New to Flipkart? Create an account
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
