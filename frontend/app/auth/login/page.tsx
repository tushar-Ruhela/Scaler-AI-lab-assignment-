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
    <div className="bg-[#f1f3f6] min-h-[calc(100vh-120px)] flex items-center justify-center py-10 px-4 font-sans">
      <div className="flex flex-col md:flex-row w-full max-w-[850px] min-h-[520px] bg-white rounded-sm shadow-xl overflow-hidden">
        {/* Left sidebar - Brand Info */}
        <div className="md:w-[40%] bg-blue-primary text-white p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Login</h2>
            <p className="text-lg text-white/80 leading-relaxed font-medium">Get access to your Orders, Wishlist and Recommendations</p>
          </div>
          <div className="flex justify-center relative z-10">
            <img 
              src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/login_img_c4a81e.png" 
              alt="Login illustration"
              className="w-full max-w-[220px] object-contain drop-shadow-2xl"
            />
          </div>
          {/* Decorative circles */}
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute top-10 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
        </div>

        {/* Right section - Form */}
        <div className="flex-1 p-10 md:p-14 flex flex-col bg-white">
          <form onSubmit={handleSubmit} className="flex flex-col flex-1">
            <div className="space-y-8">
              <div className="relative group border-b-2 border-gray-100 focus-within:border-blue-primary transition-all pb-1">
                <input
                  id="login-email"
                  type="email"
                  placeholder="Enter Email/Mobile number"
                  className="w-full py-2 bg-transparent outline-none text-sm font-medium text-gray-900 placeholder:text-gray-400 placeholder:font-normal"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="relative group border-b-2 border-gray-100 focus-within:border-blue-primary transition-all pb-1">
                <input
                  id="login-password"
                  type={showPw ? 'text' : 'password'}
                  placeholder="Enter Password"
                  className="w-full py-2 bg-transparent outline-none text-sm font-medium text-gray-900 placeholder:text-gray-400 placeholder:font-normal pr-10"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-blue-primary hover:text-blue-dark transition-colors font-bold text-xs"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <p className="text-[11px] text-gray-400 mt-8 leading-relaxed font-medium">
              By continuing, you agree to Flipkart&apos;s <a href="#" className="text-blue-primary hover:underline font-bold">Terms of Use</a> and <a href="#" className="text-blue-primary hover:underline font-bold">Privacy Policy</a>.
            </p>

            <button 
              type="submit" 
              className="w-full bg-[#fb641b] text-white py-4 rounded-sm font-bold shadow-lg hover:bg-[#f4511e] hover:shadow-xl active:scale-[0.99] transition-all uppercase tracking-wide disabled:bg-gray-300 disabled:shadow-none mt-6 text-sm" 
              disabled={loading} 
              id="login-submit-btn"
            >
              {loading ? (
                 <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    LOGGING IN...
                 </span>
              ) : 'Login'}
            </button>
            
            <div className="text-center text-[11px] text-gray-400 mt-6 bg-gray-50 py-2 rounded-sm border border-gray-100 font-medium">
              Demo Credentials: <span className="text-gray-700">demo@example.com</span> / <span className="text-gray-700">demo123</span>
            </div>

            <div className="mt-auto pt-10 text-center">
              <Link href="/auth/signup" className="text-sm font-bold text-blue-primary hover:text-blue-dark transition-colors py-3 px-4 rounded-sm border border-transparent hover:bg-blue-primary/5">
                New to Flipkart? Create an account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
