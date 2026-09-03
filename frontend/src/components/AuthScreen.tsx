import React, { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  Shield,
  Building2,
  ArrowRight,
  ChevronLeft,
  Moon,
  Sun,
  CheckCircle2
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface AuthScreenProps {
  onLoginSuccess: (user: { name: string; role: string; emailOrPhone: string }) => void;
  onBack?: () => void;
}

type AuthMode = 'signin' | 'signup';
type LoginMethod = 'email' | 'mobile' | 'gov_id';

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess, onBack }) => {
  const { theme, toggleTheme } = useTheme();
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');

  // Form Fields
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [govId, setGovId] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('NDMA');
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      let userName = fullName || 'Officer / Citizen';
      let userRole = 'Citizen User';

      if (loginMethod === 'gov_id') {
        userRole = `Gov Authority (${department})`;
        userName = fullName || 'Gov Authority Official';
      } else if (loginMethod === 'mobile') {
        userName = fullName || `User (${mobile || '+91 98765 43210'})`;
      } else {
        userName = fullName || (email ? email.split('@')[0] : 'Authorised Officer');
      }

      onLoginSuccess({
        name: userName,
        role: userRole,
        emailOrPhone: loginMethod === 'mobile' ? mobile : (loginMethod === 'gov_id' ? govId : email)
      });
    }, 600);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        name: 'Google User',
        role: 'Verified Google Account',
        emailOrPhone: 'user@gmail.com'
      });
    }, 500);
  };

  const handleDemoGovLogin = () => {
    onLoginSuccess({
      name: 'Dr. Rajesh Sharma (Director)',
      role: 'NDMA / MoRTH Authority',
      emailOrPhone: 'rajesh.sharma@gov.in'
    });
  };

  return (
    <div className="relative w-full min-h-full flex-1 flex flex-col justify-between selection:bg-blue-600 selection:text-white overflow-y-auto overflow-x-hidden">
      {/* High-res Space Earth Background matching Image 1 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(4, 8, 20, 0.3) 0%, rgba(4, 8, 20, 0.65) 45%, rgba(4, 8, 20, 0.96) 100%), url('/space_earth_bg.jpg')`
        }}
      />

      {/* Starfield Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* ========================================================================= */}
      {/* 1. TOP HEADER (Back & Theme buttons on corners matching Image 1) */}
      {/* ========================================================================= */}
      <div className="relative z-20 w-full px-4 pt-4 pb-2 flex items-center justify-between shrink-0">
        {/* Left Back / Quick Demo button */}
        <button
          onClick={onBack ? onBack : handleDemoGovLogin}
          className="w-10 h-10 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition-all backdrop-blur-md flex items-center justify-center shadow-lg active:scale-95"
          title={onBack ? "Back to Onboarding" : "Quick Instant Demo Login"}
        >
          <ChevronLeft className="w-5 h-5 text-slate-200" />
        </button>

        {/* Right Dark Mode toggle matching Image 1 */}
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-amber-300 transition-all backdrop-blur-md flex items-center justify-center shadow-lg active:scale-95"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Moon className="w-4 h-4 text-cyan-300" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT: Space Earth + "Welcome" + Login Box Downwards */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full flex-1 flex flex-col justify-end px-4 sm:px-6 pb-6 pt-4">
        {/* Glowing "Welcome" Title in Upper Center matching Image 1 */}
        <div className="text-center mb-6 space-y-1 animate-fadeIn">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight drop-shadow-[0_0_25px_rgba(59,130,246,0.6)]">
            Welcome
          </h1>
          <p className="text-xs sm:text-sm text-cyan-200/90 font-medium tracking-wide">
            Bharat Netra • Safe Routes &amp; Disaster Surveillance
          </p>
        </div>

        {/* Login / Sign Up Card Positioned Downwards with Glowing Border matching Image 1 */}
        <div className="w-full rounded-3xl bg-[#070F1E]/85 border border-cyan-500/40 p-5 sm:p-6 shadow-[0_12px_45px_rgba(0,0,0,0.85)] backdrop-blur-2xl transition-all duration-300">
          {/* Method Selection Tabs: Email / Mobile / Gov Authority */}
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-slate-900/90 border border-slate-800 mb-4">
            <button
              type="button"
              onClick={() => { setLoginMethod('email'); setErrorMsg(''); }}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
                loginMethod === 'email'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </button>

            <button
              type="button"
              onClick={() => { setLoginMethod('mobile'); setErrorMsg(''); }}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
                loginMethod === 'mobile'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Mobile</span>
            </button>

            <button
              type="button"
              onClick={() => { setLoginMethod('gov_id'); setErrorMsg(''); }}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
                loginMethod === 'gov_id'
                  ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-md ring-1 ring-cyan-400/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-cyan-300" />
              <span>Gov Auth</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Sign Up extra full name field */}
            {authMode === 'signup' && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Full Name / Official Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
                />
              </div>
            )}

            {/* Email Login Input matching Image 1 */}
            {loginMethod === 'email' && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  EMAIL ADDRESS
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Mobile Number Login Input */}
            {loginMethod === 'mobile' && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  MOBILE NUMBER
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs font-mono font-bold text-cyan-400">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full pl-12 pr-20 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (mobile.length === 10) setOtpSent(true);
                      else setErrorMsg('Please enter a valid 10-digit mobile number');
                    }}
                    className="absolute right-1.5 px-2 py-1 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-[10px] font-bold text-cyan-300 transition-all"
                  >
                    {otpSent ? 'Resend' : 'Get OTP'}
                  </button>
                </div>
                {otpSent && (
                  <div className="mt-1.5 animate-fadeIn space-y-1">
                    <label className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> OTP sent (Demo: Enter any 4 digits)
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 4-digit OTP"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-emerald-500/50 text-white text-xs text-center font-mono tracking-widest focus:outline-none"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Government Authority Credentials */}
            {loginMethod === 'gov_id' && (
              <div className="space-y-2.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1">
                    <Building2 className="w-3 h-3" /> Department / Authority
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-2xl bg-slate-900/90 border border-cyan-500/30 text-white text-xs focus:outline-none focus:border-cyan-400"
                  >
                    <option value="NDMA">National Disaster Management Authority (NDMA)</option>
                    <option value="MoRTH">Ministry of Road Transport &amp; Highways (MoRTH)</option>
                    <option value="NHAI">National Highways Authority of India (NHAI)</option>
                    <option value="SDMA">State Disaster Management Authority (SDMA)</option>
                    <option value="GSI">Geological Survey of India (GSI)</option>
                    <option value="IMD">India Meteorological Department (IMD)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Official Govt ID / NIC Email
                  </label>
                  <input
                    type="text"
                    required
                    value={govId}
                    onChange={(e) => setGovId(e.target.value)}
                    placeholder="e.g. officer.name@gov.in"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-all font-mono"
                  />
                </div>
              </div>
            )}

            {/* Password Input (with show/hide eye toggle matching Image 1) */}
            {loginMethod !== 'mobile' && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  PASSWORD
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password (min. 6 chars)"
                    className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/30 p-2 rounded-xl font-medium">
                {errorMsg}
              </div>
            )}

            {/* Primary Submit Button matching Image 1 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-extrabold text-xs tracking-wide shadow-lg shadow-blue-600/40 hover:shadow-blue-500/60 transition-all duration-200 flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{authMode === 'signin' ? 'SIGN IN & CONTINUE' : 'CREATE ACCOUNT & CONTINUE'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            {/* Divider OR matching Image 1 */}
            <div className="relative my-3 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <span className="relative px-2.5 py-0.5 rounded-md bg-slate-900 text-[9px] font-bold text-slate-400 uppercase tracking-widest border border-slate-800">
                OR
              </span>
            </div>

            {/* Google Sign In Button matching Image 1 */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700 text-slate-200 hover:text-white font-semibold text-xs transition-all duration-200 flex items-center justify-center gap-2.5 active:scale-[0.98]"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </form>

          {/* Toggle between Sign In / Sign Up */}
          <div className="mt-4 text-center text-[11px] text-slate-400">
            {authMode === 'signin' ? (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthMode('signup'); setErrorMsg(''); }}
                  className="font-bold text-cyan-400 hover:text-cyan-300 underline underline-offset-2 ml-1"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthMode('signin'); setErrorMsg(''); }}
                  className="font-bold text-cyan-400 hover:text-cyan-300 underline underline-offset-2 ml-1"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
