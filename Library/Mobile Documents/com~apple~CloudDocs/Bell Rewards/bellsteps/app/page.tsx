import Link from 'next/link';
import { BellIcon } from '@/components/BellIcon';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-4xl w-full text-center">
        <div className="mb-8 flex justify-center">
          <BellIcon color="#3498DB" size={120} />
        </div>
        
        <h1 className="text-6xl font-bold text-gray-900 mb-4">
          BellSteps
        </h1>
        
        <p className="text-2xl text-gray-700 mb-8">
          Handbells Progression for Reception
        </p>
        
        <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
          Track your journey from Bronze Star to Black Belt. Access videos, lesson plans, 
          games, and assessments designed for ages 4–5.
        </p>
        
        <Link
          href="/login"
          className="inline-block px-8 py-4 bg-blue-600 text-white text-xl font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
