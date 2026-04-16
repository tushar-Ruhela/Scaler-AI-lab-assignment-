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
    <div className="bg-[#f1f3f6] min-h-[calc(100vh-120px)] flex items-center justify-center py-10 px-4 font-sans">
      <div className="flex flex-col md:flex-row w-full max-w-[850px] min-h-[520px] bg-white rounded-sm shadow-xl overflow-hidden">
        {/* Left sidebar - Brand Info */}
        <div className="md:w-[40%] bg-blue-primary text-white p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Looks like you&apos;re new here!</h2>
            <p className="text-lg text-white/80 leading-relaxed font-medium">Sign up with your details to get started</p>
          </div>
          <div className="flex justify-center relative z-10 mb-10">
             <div className="text-8xl drop-shadow-2xl animate-bounce">
                🎉
             </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute top-10 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
        </div>

        {/* Right section - Form */}
        <div className="flex-1 p-10 md:p-14 flex flex-col bg-white">
          <div className="mb-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h3>
            <p className="text-gray-500 text-sm font-medium">Join millions of happy shoppers</p>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col flex-1">
            <div className="space-y-6">
              <div className="relative group border-b-2 border-gray-100 focus-within:border-blue-primary transition-all pb-1">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Full Name</label>
                <input
                  id="signup-name"
                  type="text"
                  placeholder="Enter full name"
                  className="w-full py-1 bg-transparent outline-none text-sm font-medium text-gray-900 placeholder:text-gray-300"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>

              <div className="relative group border-b-2 border-gray-100 focus-within:border-blue-primary transition-all pb-1">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">EmailID</label>
                <input
                  id="signup-email"
                  type="email"
                  placeholder="Enter email address"
                  className="w-full py-1 bg-transparent outline-none text-sm font-medium text-gray-900 placeholder:text-gray-300"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="relative group border-b-2 border-gray-100 focus-within:border-blue-primary transition-all pb-1">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Password</label>
                <input
                  id="signup-password"
                  type={showPw ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  className="w-full py-1 bg-transparent outline-none text-sm font-medium text-gray-900 placeholder:text-gray-300 pr-10"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-0 bottom-2 text-blue-primary hover:text-blue-dark transition-colors font-bold text-xs"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-[#fb641b] text-white py-4 rounded-sm font-bold shadow-lg hover:bg-[#f4511e] hover:shadow-xl active:scale-[0.99] transition-all uppercase tracking-wide disabled:bg-gray-300 disabled:shadow-none mt-10 text-sm" 
              disabled={loading} 
              id="signup-submit-btn"
            >
              {loading ? (
                 <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    CREATING ACCOUNT...
                 </span>
              ) : 'Continue'}
            </button>
            
            <div className="mt-8 text-center">
              <Link href="/auth/login" className="text-sm font-bold text-blue-primary hover:text-blue-dark transition-colors py-3 px-6 rounded-sm border border-gray-100 bg-gray-50/50 hover:bg-gray-50 flex items-center justify-center group">
                Existing User? Login
                <span className="ml-1 group-hover:translate-x-1 transition-transform">&rsaquo;</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
