import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Phone, ArrowRight } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phone.length >= 10) {
      setStep(2);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp === '123456') { // Mock OTP
      onLogin({ id: Date.now().toString(), phone, name: 'User_' + phone.slice(-4) });
    } else {
      alert('Invalid OTP (Try 123456)');
    }
  };

  return (
    <div className="flex h-full items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-900/20 via-dark to-dark">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 glass-card"
      >
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500 shadow-lg shadow-brand-500/30">
            <MessageSquare className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">ChatFlow</h1>
          <p className="text-gray-400 mt-2 text-center">
            {step === 1 ? 'Enter your phone number to continue' : 'Enter the verification code sent to you'}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full rounded-xl bg-white/5 border border-white/10 py-4 pl-12 pr-4 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 py-4 font-semibold text-white transition-all hover:bg-brand-600 active:scale-95"
            >
              Get OTP <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="flex justify-between gap-4">
              <input
                type="text"
                maxLength="6"
                placeholder="000000"
                className="w-full rounded-xl bg-white/5 border border-white/10 py-4 text-center text-2xl font-bold tracking-[1em] focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                autoFocus
                required
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-brand-500 py-4 font-semibold text-white transition-all hover:bg-brand-600 active:scale-95"
            >
              Verify & Login
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-sm text-gray-400 hover:text-white transition-colors"
            >
              Change phone number
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
