'use client';

import { useState, useTransition } from 'react';
import { signIn } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { BellIcon } from '@/components/BellIcon';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [isPending, startTransition] = useTransition();
  const isDev = process.env.NODE_ENV === 'development';

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await signIn('email', { email, callbackUrl: '/app' });
        toast.success('Check your email for the magic link!');
      } catch (error) {
        toast.error('Email login not configured. Please use Dev Login instead.');
      }
    });
  };

  const handleDevLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }
    
    startTransition(async () => {
      try {
        const result = await signIn('credentials', { 
          email, 
          callbackUrl: '/app',
          redirect: false 
        });
        
        if (result?.error) {
          toast.error(`Login failed: ${result.error}`);
          console.error('Login error:', result.error);
        } else if (result?.ok) {
          toast.success('Signing in...');
          window.location.href = '/app';
        }
      } catch (error: any) {
        console.error('Login error:', error);
        toast.error(`Failed to sign in: ${error.message || 'Unknown error'}`);
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <BellIcon color="#3498DB" size={80} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to BellSteps</h1>
          <p className="text-gray-600">Sign in to continue your progression</p>
        </div>

        {isDev ? (
          <>
            <form onSubmit={handleDevLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <button
                type="submit"
                disabled={isPending || !email}
                className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? 'Signing in...' : 'Sign In (Dev Mode)'}
              </button>
            </form>
            
            <p className="mt-4 text-sm text-gray-500 text-center">
              Dev mode: No password needed. Enter any email to sign in.
            </p>
          </>
        ) : (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Sending...' : 'Send Magic Link'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
