import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { authService } from '../services/authService';
import { Button } from '../components/ui/Button';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    await authService.forgotPassword(email);
    setIsLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 card-shadow space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block">
            <img src="/affordpro-logo.png" alt="AffordPro Logo" className="h-12 w-auto mx-auto object-contain" />
          </Link>
          <h1 className="text-2xl font-black text-slate-900">Reset Password</h1>
          <p className="text-slate-500 text-xs">Enter your account email to receive a password reset link</p>
        </div>

        {submitted ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <p className="text-xs text-slate-700 font-semibold">
              We have sent a password reset instruction link to <strong>{email}</strong>.
            </p>
            <Link to="/login" className="inline-block text-xs font-bold text-indigo-600 hover:underline">
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" size="md" fullWidth isLoading={isLoading}>
              Send Reset Link
            </Button>
          </form>
        )}

        <div className="pt-4 border-t border-slate-100 text-center">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600">
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};
